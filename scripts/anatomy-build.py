"""Offline conversion of the CC BY-SA 2.1 JP BodyParts3D 3.0 STL source.

Usage: PYTHONPATH=<trimesh/numpy/fast_simplification> python scripts/anatomy-build.py
       <BodyParts3D checkout> <exported Rehaboom catalog.json>
No downloads or source rewrites are performed by the application build.
"""
import sys, json, base64, re
from pathlib import Path
import numpy as np
import trimesh

source=Path(sys.argv[1])/"assets/BodyParts3D_data"
catalog=json.loads(Path(sys.argv[2]).read_text())['details']
names=dict(line.split('\t',1) for line in (source/'parts_list_e.txt').read_text().splitlines()[1:] if '\t' in line)
available={p.stem for p in (source/'stl').glob('*.stl')}
cache={}
def original(fid):
    if fid not in cache: cache[fid]=trimesh.load_mesh(source/'stl'/(fid+'.stl'),process=True)
    return cache[fid]
def xyz(points):
    p=np.array(points,dtype=float).reshape(-1,3)
    return np.column_stack((p[:,0],p[:,2]-850,-p[:,1]-75))*.01
def bounds(fid): return original(fid).bounds
def center(fid): return xyz([bounds(fid).mean(0)])[0]

# Rest landmarks are explicit educational joint centres in the source coordinates.
# These keep every source structure in the same space; no independent recentering.
heads={
 'root':[0,0,0], 'spine05':[0,.35,.1], 'spine04':[0,.95,.05],
 'spine03':[0,1.7,0], 'spine02':[0,2.7,-.05], 'spine01':[0,3.8,-.1],
 'neck01':[0,5.0,-.05], 'neck02':[0,5.45,-.02], 'neck03':[0,5.85,.02], 'head':[0,6.3,.05],
}
for side,sign in [('R',-1),('L',1)]:
    for name,p in {
      'clavicle':[.15,4.95,.55], 'shoulder01':[1.25,4.95,.05],
      'upperarm01':[1.62,4.68,-.05], 'upperarm02':[1.78,4.15,-.05],
      'lowerarm01':[2.27,2.02,-.02], 'lowerarm02':[2.47,.92,.13], 'wrist':[2.67,-.28,.2],
      'pelvis':[0,0,0], 'upperleg01':[.75,-.38,-.03], 'upperleg02':[.86,-1.25,-.03],
      'lowerleg01':[.91,-4.45,-.02], 'lowerleg02':[.86,-6.15,-.02], 'foot':[.78,-7.78,.05],
    }.items(): heads[name+'.'+side]=np.array([p[0]*sign,p[1],p[2]])
old=json.loads(Path('anatomy/motion-human.json').read_text())
bones=[[b[0],b[1],list(map(float,heads[b[0]]))] for b in old['bones']]
index={b[0]:i for i,b in enumerate(bones)}
segments={}
def add(name,parent,head,tail):
    index[name]=len(bones);bones.append([name,index[parent],list(head)])
    segments[name]=(np.array(head),np.array(tail))
for side in ['R','L']:
    for start,end in [('upperarm01','lowerarm01'),('lowerarm01','wrist'),('upperleg01','lowerleg01'),('lowerleg01','foot')]:
        segments[start+'.'+side]=(heads[start+'.'+side],heads[end+'.'+side])
    segments['wrist.'+side]=(heads['wrist.'+side],heads['wrist.'+side]+np.array([0,-1.25,0]))
    segments['foot.'+side]=(heads['foot.'+side],heads['foot.'+side]+np.array([0,-.4,1.6]))
    segments['shoulder01.'+side]=(heads['shoulder01.'+side],heads['upperarm01.'+side])
for a,b in [('root','spine05'),('spine05','spine04'),('spine04','spine03'),('spine03','spine02'),('spine02','spine01'),('spine01','neck01'),('neck01','neck02'),('neck02','neck03'),('neck03','head')]: segments[a]=(heads[a],heads[b])
segments['head']=(np.array(heads['head']),np.array([0,8,.05]))

bone_map={}
for side,word in [('R','right'),('L','left')]:
 for fid,n in names.items():
    if fid not in available: continue
    if n==word+' humerus': bone_map[fid]='upperarm01.'+side
    elif n in [word+' radius',word+' ulna']: bone_map[fid]='lowerarm01.'+side
    elif n==word+' scapula': bone_map[fid]='shoulder01.'+side
    elif n==word+' clavicle': bone_map[fid]='clavicle.'+side
    elif n==word+' femur': bone_map[fid]='upperleg01.'+side
    elif n in [word+' tibia',word+' fibula']: bone_map[fid]='lowerleg01.'+side
    elif n==word+' patella': bone_map[fid]='lowerleg01.'+side
    elif n==word+' hip bone': bone_map[fid]='root'
    elif n.startswith(word+' ') and any(n.endswith(' '+s) for s in ['scaphoid','lunate','triquetral','pisiform','trapezium','trapezoid','capitate','hamate']): bone_map[fid]='wrist.'+side
    elif word in n and ('metacarpal' in n): bone_map[fid]='wrist.'+side
    elif word in n and any(s in n for s in ['metatarsal','talus','calcaneus','navicular bone','cuneiform bone','cuboid bone']): bone_map[fid]='foot.'+side
    elif word in n and 'phalanx' in n: bone_map[fid]=('wrist.' if 'finger' in n or 'thumb' in n else 'foot.')+side
 # Radius rotates around the forearm axis; the ulna is a separate mesh.
 radius=next(f for f,n in names.items() if n==word+' radius' and f in available)
 rp=xyz(original(radius).vertices);prox=rp[rp[:,1]>rp[:,1].max()-.2].mean(0)
 add('radius.'+side,'lowerarm01.'+side,prox,heads['wrist.'+side]);bone_map[radius]='radius.'+side
 # The thumb's CMC articulation moves the first metacarpal as well as the phalanges.
 metacarpal=next(f for f,n in names.items() if n==word+' first metacarpal bone' and f in available)
 mp=xyz(original(metacarpal).vertices);mh=mp[mp[:,1]>mp[:,1].max()-.12].mean(0)
 add('thumb-cmc.'+side,'wrist.'+side,mh,mp.mean(0));bone_map[metacarpal]='thumb-cmc.'+side
 # Real finger bones and their local pivot hierarchy.
 for digit in ['thumb','index finger','middle finger','ring finger','little finger']:
    parent=('thumb-cmc.' if digit=='thumb' else 'wrist.')+side
    for part in ['proximal','middle','distal']:
      found=[f for f,n in names.items() if f in available and n==f'{part} phalanx of {word} {digit}']
      if not found: continue
      fid=found[0]; mesh=original(fid); p=xyz(mesh.vertices)
      h=p[np.argmax(p[:,1])].copy();h[0]=p[p[:,1]>p[:,1].max()-.12,0].mean();h[2]=p[p[:,1]>p[:,1].max()-.12,2].mean()
      t=p[np.argmin(p[:,1])]
      name=digit.split()[0]+'-'+part+'.'+side
      add(name,parent,h,t);bone_map[fid]=name;parent=name
 # Toe chains use the dorsal long axis, with actual mesh landmarks.
 for digit in ['big toe','second toe','third toe','fourth toe','little toe']:
    parent='foot.'+side
    for part in ['proximal','middle','distal']:
      found=[f for f,n in names.items() if f in available and n==f'{part} phalanx of {word} {digit}']
      if not found: continue
      fid=found[0];p=xyz(original(fid).vertices);near=p[p[:,2]<p[:,2].min()+.12];far=p[p[:,2]>p[:,2].max()-.12]
      h=near.mean(0);t=far.mean(0);name='toe-'+digit.split()[0]+'-'+part+'.'+side
      add(name,parent,h,t);bone_map[fid]=name;parent=name
for fid,n in names.items():
 if fid not in available:continue
 if re.fullmatch('(first|second|third|fourth|fifth|sixth|seventh) cervical vertebra',n) or n in ['atlas','axis']:
    y=center(fid)[1];bone_map[fid]='neck01' if y<5.45 else 'neck02' if y<5.85 else 'neck03'
 elif n.endswith('thoracic vertebra') or n.endswith('lumbar vertebra'):
    y=center(fid)[1];bone_map[fid]=min(['spine05','spine04','spine03','spine02','spine01'],key=lambda b:abs(heads[b][1]-y))
 elif n in ['sacrum','sternum','skull']:
    bone_map[fid]={'sacrum':'root','sternum':'spine01','skull':'head'}[n]
 elif n in ['occipital bone','frontal bone','sphenoid bone','ethmoid','mandible','right temporal bone','left temporal bone','right parietal bone','left parietal bone','right maxilla','left maxilla','maxillary dental arcade']:
    bone_map[fid]='head'
 elif n in ['body of sternum','manubrium of sternum','xiphoid process']:
    bone_map[fid]='spine01'
 elif re.fullmatch('(right|left) (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) rib',n):
    p=xyz(original(fid).vertices);anchor=p[p[:,2]<p[:,2].min()+.15].mean(0)
    parent=min(['spine05','spine04','spine03','spine02','spine01'],key=lambda b:abs(heads[b][1]-anchor[1]))
    name='rib-'+n.split()[1]+('.R' if n.startswith('right') else '.L');add(name,parent,anchor,p.mean(0));bone_map[fid]=name

aliases={
 'deltoideus':'deltoid', 'rhomboideus major':'rhomboid major','rhomboideus minor':'rhomboid minor',
 'sternocleidomastoideus':'sternocleidomastoid','scalenus anterior':'scalenus anterior','scalenus medius':'scalenus medius','scalenus posterior':'scalenus posterior',
 'obliquus externus abdominis':'external oblique','obliquus internus abdominis':'internal oblique',
 'peroneus longus':'fibularis longus','peroneus brevis':'fibularis brevis','peroneus tertius':'fibularis tertius',
 'rotatores lumbales':'lumbar rotator','rotatores thoracales':'thoracic rotator','infraspinatus':'infraspinatus muscle',
}
muscle_map={}
for key in catalog:
    label=re.sub(r'^Mm?\.\s*','',key).lower()
    if '/' in label or label in ['hamstrings','adductoren','diepe pelvitrochantaire spieren','iliopsoas','erector spinae','triceps surae','rhomboidei','scaleni','rotatores','intercostales']:continue
    label=aliases.get(label,label)
    matches=[fid for fid,n in names.items() if fid in available and 'right' in n and (n==f'right {label}' or n.endswith(f' of right {label}') or n.endswith(f' part of right {label}'))]
    # Prefer actual subdivisions over a composite if both are provided.
    if len(matches)>1: matches=[f for f in matches if names[f]!=f'right {label}'] or matches
    for fid in matches: muscle_map[fid]=key
for fid,key in [('FMA23083','Mm. Rotatores Thoracales'),('FMA9756','Mm. Intercostales'),('FMA9757','Mm. Intercostales')]:
    if fid in available:muscle_map[fid]=key
for fid,key in [('FMA13392','Mm. Scaleni'),('FMA13390','Mm. Scaleni'),('FMA13388','Mm. Scaleni')]:
    if fid in available:muscle_map[fid]=key
for fid,n in names.items():
    if fid in available and n=='right splenius cervicis':muscle_map[fid]='M. Splenius Capitis / Cervicis'
    if fid in available and n in ['right obturator internus','right obturator externus','right gemellus superior','right gemellus inferior']:
        muscle_map[fid]='Diepe pelvitrochantaire spieren'
for fid,key in list(muscle_map.items()):
    if 'right' in names[fid]:
        counterpart=names[fid].replace('right','left')
        match=next((f for f,n in names.items() if n==counterpart and f in available),None)
        if match:muscle_map[match]=key

vertices=[];triangles=[];joints=[];weights=[];colors=[];entries=[];offset=0
allsegments=list(segments)
def skin(p,rigid=None,side='R',muscle_key=None):
 if rigid:
    ids=np.zeros((len(p),4),dtype=np.uint8);ids[:,0]=index[rigid];ws=np.zeros_like(ids);ws[:,0]=255;return ids,ws
 # Smooth educational skinning; it visualises movement, not contractile mechanics.
 # Restrict left/right candidates so a medial surface cannot jump to the other limb.
 excluded=('toe-','thumb-','index-','middle-','ring-','little-')+(('rib-',) if muscle_key!='Mm. Intercostales' else ())
 candidates=[b for b in allsegments if not b.endswith('.'+('R' if side=='L' else 'L')) and not b.startswith(excluded)]
 dist=[]
 for b in candidates:
    a,z=map(np.array,segments[b]);d=z-a;t=np.clip((p-a)@d/(d@d or 1),0,1);dist.append(np.linalg.norm(p-a-t[:,None]*d,axis=1))
 dist=np.array(dist).T
 nearest=np.argsort(dist,axis=1)[:,:2];dd=np.take_along_axis(dist,nearest,1)
 w=1/(dd+.08)**4;w=w/w.sum(1)[:,None]
 ids=np.zeros((len(p),4),dtype=np.uint8);ws=np.zeros_like(ids)
 ids[:,:2]=np.array([index[b] for b in candidates])[nearest];ws[:,0]=np.round(w[:,0]*255).astype(np.uint8);ws[:,1]=255-ws[:,0]
 return ids,ws
for fid,kind,key in [(f,'bone',None) for f in bone_map]+[(f,'muscle',k) for f,k in muscle_map.items()]:
    mesh=original(fid).copy();target=520 if kind=='muscle' else 420
    if fid=='FMA46565':target=2400
    if 'scapula' in names[fid] or 'hip bone' in names[fid]:target=1100
    if len(mesh.faces)>target:mesh=mesh.simplify_quadric_decimation(face_count=target)
    side='L' if 'left' in names[fid] else 'R'
    p=xyz(mesh.vertices);ids,ws=skin(p,bone_map.get(fid),side,key)
    vertices.extend(p.tolist());triangles.extend((mesh.faces+offset).reshape(-1).tolist());joints.extend(ids.reshape(-1).tolist());weights.extend(ws.reshape(-1).tolist())
    col=[225,211,182] if kind=='bone' else [161,74,68]
    colors.extend(col*len(p))
    entries.append({'id':fid,'name':names[fid],'kind':kind,'key':key,'side':side,'rig':bone_map.get(fid),'first':offset,'count':len(p),'triangleFirst':len(triangles)-len(mesh.faces)*3,'triangleCount':len(mesh.faces)*3})
    offset+=len(p)
def packed(a,dtype):return base64.b64encode(np.array(a,dtype=dtype).tobytes()).decode()
out={'version':'4.19','license':'CC BY-SA 2.1 JP','sourceCommit':'2c83c698788cff57f6317bddcf712e7acfbea7d8','bones':bones,
 'positions':packed(np.round(np.array(vertices)*1000).reshape(-1),'<i2'),'triangles':packed(triangles,'<u4'),'indexType':'uint32',
 'joints':packed(joints,'u1'),'weights':packed(weights,'u1'),'colors':packed(colors,'u1'),'meshes':entries,
 'handDirection':[0,-1,0],'thumbDirection':[-.55,-.7,.05], 'footTip':[.02,-.35,1.8],
 'note':'Source mesh shape retained with polygon reduction. Rest landmarks and skinning are educational approximations; no individual ROM or tissue strain is measured.'}
Path('anatomy/motion-anatomy.json').write_text(json.dumps(out,separators=(',',':')))
Path('docs/anatomy-source-manifest.json').write_text(json.dumps({'license':out['license'],'sourceCommit':out['sourceCommit'],'meshes':entries,'catalogWithMesh':sorted(set(muscle_map.values())),'catalogWithoutMesh':sorted(set(catalog)-set(muscle_map.values()))},indent=2))
print(json.dumps({'structures':len(entries),'muscleMeshes':len(muscle_map),'catalogMuscles':len(set(muscle_map.values())),'vertices':offset,'triangles':len(triangles)//3,'bones':len(bones)},indent=2))
