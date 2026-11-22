/* Rehaboom motion atlas. MakeHuman Community CC0 geometry and rig, posed for education. */
(() => {
  const definitions = {
    's-ante':['shoulderSide','shoulder',0,167], 's-retro':['shoulderExtension','shoulder',0,-44],
    's-abd':['shoulderFront','abduct',0,165], 's-add':['shoulderFront','abduct',90,0],
    's-endo':['shoulderHigh','shoulderTwist',0,-58], 's-exo':['shoulderHigh','shoulderTwist',0,66],
    's-habd':['shoulderHigh','horizontal',0,105], 's-hadd':['shoulderHigh','horizontal',90,-25],
    'g-elev':['scapBack','elevate',0,.51], 'g-depr':['scapBack','elevate',0,-.37],
    'g-urot':['scapBack','scapular',0,52], 'g-drot':['scapBack','scapular',52,0],
    'g-prot':['scapHigh','girdle',0,23], 'g-retr':['scapHigh','girdle',0,-19],
    'e-flex':['armSide','elbow',0,135], 'e-ext':['armSide','elbow',125,0],
    'e-sup':['handHigh','forearm',-75,80], 'e-pro':['handHigh','forearm',80,-75],
    'w-pf':['wristSide','wristFlex',0,68], 'w-df':['wristSide','wristFlex',0,-63],
    'w-rd':['wristHigh','wristSide',0,20], 'w-ud':['wristHigh','wristSide',0,-31],
    'h-flex':['hipSide','hip',0,100], 'h-ext':['hipSide','hip',0,-23],
    'h-abd':['hipFront','hipSide',0,42], 'h-add':['hipFront','hipSide',40,-5],
    'h-endo':['seatedHip','hipTwist',0,-36], 'h-exo':['seatedHip','hipTwist',0,42],
    'h-abd-bent':['seatedHip','seatedAbduct',0,35], stance:['stanceFront','stance',0,1],
    'k-flex':['kneeSide','knee',0,117], 'k-ext':['kneeSide','knee',105,0],
    'k-endo':['seatedKnee','kneeTwist',0,-26], 'k-exo':['seatedKnee','kneeTwist',0,30],
    'a-pf':['ankleSide','ankle',0,44], 'a-df':['ankleSide','ankle',0,-23],
    'a-sup':['footAngle','footCombo',0,28], 'a-pro':['footAngle','footCombo',0,-20],
    'a-inv':['footFront','footTilt',0,26], 'a-ev':['footFront','footTilt',0,-17],
    'n-flex':['neckSide','neckX',0,47], 'n-ext':['neckSide','neckX',0,-52],
    'n-lat':['neckFront','neckZ',0,41], 'n-rot':['neckHigh','neckY',0,-66],
    't-flex':['torsoSide','spineX',0,60], 't-ext':['torsoSide','spineX',0,-25],
    't-lat':['torsoFront','spineZ',0,32], 't-rot':['torsoHigh','spineY',0,-43],
  };
  // Position, camera offset, vertical span and orientation labels.
  const views = {
    muscleScapula:[[-.95,4.9,-.15],[-.38,.25,-1],6.7,'Schouderblad · achteraanzicht','',''],
    muscleAnkle:[[-1.6,-5.65,1.25],[-1,.1,.04],8.25,'Onderbeen · zijaanzicht','Hiel','Tenen'],
    shoulderSide:[[0,5.2,.65],[-1,.07,.06],15.4,'Zijaanzicht','Achter','Voor'],
    shoulderExtension:[[0,3.6,-.52],[-1,.07,.06],11.6,'Zijaanzicht','Achter','Voor'],
    shoulderFront:[[-1.5,5.15,0],[.03,.08,1],15.5,'Vooraanzicht','Rechterzijde',''],
    shoulderHigh:[[-2.2,4.9,1.35],[-.48,1,.75],11.9,'Schuin bovenaanzicht','',''],
    scapBack:[[-.3,5.4,0],[-.19,.12,-1],8.6,'Achteraanzicht','','Rechterzijde'],
    scapHigh:[[-.5,5,.05],[-.38,1,-.8],7.7,'Schuin bovenaanzicht','',''],
    armSide:[[-1.8,2.7,1],[-1,.08,.02],8.6,'Zijaanzicht','Achter','Voor'],
    handHigh:[[-1.75,2.65,1.6],[-.61,.77,.69],6.4,'Onderarm van schuin boven','',''],
    wristSide:[[-1.8,2.65,2.5],[-1,.13,.04],4.8,'Pols van opzij','',''],
    wristHigh:[[-1.8,2.65,2.5],[-.25,1,.16],4.8,'Pols van boven','',''],
    stanceFront:[[0,-1,.3],[0,.08,1],15.1,'Vooraanzicht · bekken stabiel','',''],
    hipSide:[[0,-2.2,.4],[-1,.05,.04],14.6,'Zijaanzicht','Achter','Voor'],
    hipFront:[[-1.1,-2.6,0],[0,.04,1],13.1,'Vooraanzicht','Rechterzijde',''],
    seatedHip:[[-.4,-1.6,1.55],[-.26,.24,1],11,'Vooraanzicht · zittend','',''],
    kneeSide:[[-1.6,-4.2,-.6],[-1,.13,.07],9.7,'Zijaanzicht','Achter','Voor'],
    seatedKnee:[[-.8,-3,2.6],[-.35,.28,1],7.8,'Onderbeen · knie gebogen','',''],
    ankleSide:[[-1.5,-6.8,2.35],[-1,.1,.08],6.25,'Zijaanzicht','Hiel','Tenen'],
    footAngle:[[-1.5,-6.65,.65],[-.7,.47,1],5.1,'Schuin vooraanzicht','',''],
    footFront:[[-1.5,-6.55,.6],[-.05,.29,1],4.75,'Vooraanzicht','Buitenzijde','Binnenzijde'],
    neckSide:[[0,6.4,.35],[-1,.08,.03],6.7,'Zijaanzicht','Achter','Voor'],
    neckFront:[[0,6.5,.2],[0,.08,1],6.7,'Vooraanzicht','',''],
    neckHigh:[[0,6.7,.45],[-.16,.74,1],6.2,'Schuin bovenaanzicht','',''],
    torsoSide:[[0,3,1.15],[-1,.1,.04],12.1,'Zijaanzicht','Achter','Voor'],
    torsoFront:[[0,3.4,0],[0,.07,1],12.4,'Vooraanzicht','',''],
    torsoHigh:[[0,3.6,.1],[-.2,.74,1],12.2,'Schuin bovenaanzicht','',''],
  };

  const asset = './anatomy/motion-human.json?v=2';
  const rendererAsset = './anatomy/motion-three.js?v=3';
  let engine, loading, failed = false;
  const radians = angle => angle*Math.PI/180;
  const blend = (a,b,t) => a+(b-a)*t;

  function loadRenderer() {
    if (window.THREE) return Promise.resolve();
    return new Promise((resolve,reject) => {
      const script = document.createElement('script');
      script.src = rendererAsset;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }
  function bytes(text) {
    return Uint8Array.from(atob(text), c => c.charCodeAt(0));
  }
  // Draw the same skinned model on devices where a graphics context is unavailable.
  function softwareRenderer(T,canvas,body,objects) {
    const width=canvas.width=504, height=canvas.height=420;
    const context=canvas.getContext('2d');
    const image=context.createImageData(width,height), pixels=image.data;
    const depth=new Float32Array(width*height);
    const transform=new T.Matrix4();
    const gamma=Float32Array.from({length:256},(_,i)=>255*Math.pow(i/255,1/2.2));
    const vertexStores=new Map();
    function meshData(mesh,skinned) {
      const g=mesh.geometry;
      const coordinates=g.attributes.position.array;
      const count=coordinates.length/3;
      const indexed=g.index?.array;
      const color=g.attributes.color?.array;
      const flat=new T.Color(mesh.material.color);
      return {
        mesh,coordinates,normals:g.attributes.normal.array,count,indexed,color,flat,
        joints:skinned?g.attributes.skinIndex.array:null,
        weights:skinned?g.attributes.skinWeight.array:null,
        screen:new Float32Array(count*6),
      };
    }
    for(const mesh of [body,...objects])vertexStores.set(mesh,meshData(mesh,mesh===body));
    const byteColor=(value,light)=>gamma[Math.min(255,Math.max(0,(255*value*light)|0))];
    function project(store,projection) {
      const {mesh,coordinates,normals,count,color,flat,joints,weights,screen}=store;
      const world=mesh.matrixWorld.elements;
      const bones=joints?body.skeleton.boneMatrices:null;
      for(let i=0;i<count;i++) {
        const p=3*i, j=4*i, s=6*i;
        const x=coordinates[p],y=coordinates[p+1],z=coordinates[p+2];
        const nx=normals[p],ny=normals[p+1],nz=normals[p+2];
        let wx=0,wy=0,wz=0,vx=0,vy=0,vz=0;
        for(let k=0;k<(bones?4:1);k++) {
          const w=bones?weights[j+k]/255:1;
          if(w===0)continue;
          const m=bones||world, b=bones?16*joints[j+k]:0;
          wx+=w*(m[b]*x+m[b+4]*y+m[b+8]*z+m[b+12]);
          wy+=w*(m[b+1]*x+m[b+5]*y+m[b+9]*z+m[b+13]);
          wz+=w*(m[b+2]*x+m[b+6]*y+m[b+10]*z+m[b+14]);
          vx+=w*(m[b]*nx+m[b+4]*ny+m[b+8]*nz);
          vy+=w*(m[b+1]*nx+m[b+5]*ny+m[b+9]*nz);
          vz+=w*(m[b+2]*nx+m[b+6]*ny+m[b+10]*nz);
        }
        screen[s]=(1+projection[0]*wx+projection[4]*wy+projection[8]*wz+projection[12])*width*.5;
        screen[s+1]=(1-projection[1]*wx-projection[5]*wy-projection[9]*wz-projection[13])*height*.5;
        screen[s+2]=projection[2]*wx+projection[6]*wy+projection[10]*wz+projection[14];
        const inv=1/(Math.sqrt(vx*vx+vy*vy+vz*vz)||1);
        const key=Math.max(0,(-.42*vx+.62*vy+.66*vz)*inv);
        const rim=Math.max(0,(.52*vx+.29*vy-.8*vz)*inv);
        const lighting=.39+.62*key+.23*rim+.1*Math.max(0,vy*inv);
        screen[s+3]=byteColor(color?color[p]/255:flat.r,lighting);
        screen[s+4]=byteColor(color?color[p+1]/255:flat.g,lighting);
        screen[s+5]=byteColor(color?color[p+2]/255:flat.b,lighting);
      }
    }
    function raster({screen,indexed,count,mesh}) {
      const total=indexed?indexed.length:count;
      for(let i=0;i<total;i+=3) {
        const a=6*(indexed?indexed[i]:i), b=6*(indexed?indexed[i+1]:i+1), c=6*(indexed?indexed[i+2]:i+2);
        const ax=screen[a],ay=screen[a+1],bx=screen[b],by=screen[b+1],cx=screen[c],cy=screen[c+1];
        const d=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);
        if(Math.abs(d)<.01 || (mesh===body&&d>0))continue;
        const left=Math.max(0,Math.floor(Math.min(ax,bx,cx)));
        const right=Math.min(width-1,Math.ceil(Math.max(ax,bx,cx)));
        const top=Math.max(0,Math.floor(Math.min(ay,by,cy)));
        const bottom=Math.min(height-1,Math.ceil(Math.max(ay,by,cy)));
        const uStep=(by-cy)/d, vStep=(cy-ay)/d, uRow=(cx-bx)/d, vRow=(ax-cx)/d;
        for(let y=top;y<=bottom;y++) {
          let u=uStep*(left+.5-cx)+uRow*(y+.5-cy), v=vStep*(left+.5-cx)+vRow*(y+.5-cy);
          for(let x=left;x<=right;x++,u+=uStep,v+=vStep) {
            const w=1-u-v;
            if(u<0||v<0||w<0)continue;
            const z=u*screen[a+2]+v*screen[b+2]+w*screen[c+2], p=y*width+x;
            if(z>=depth[p])continue;
            depth[p]=z;
            pixels[4*p]=u*screen[a+3]+v*screen[b+3]+w*screen[c+3];
            pixels[4*p+1]=u*screen[a+4]+v*screen[b+4]+w*screen[c+4];
            pixels[4*p+2]=u*screen[a+5]+v*screen[b+5]+w*screen[c+5];
            pixels[4*p+3]=255;
          }
        }
      }
    }
    return {
      render(scene,camera) {
        pixels.fill(0);
        depth.fill(Infinity);
        body.skeleton.update();
        const projection=transform.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).elements;
        for(const [mesh,store] of vertexStores) {
          if(!mesh.visible||(mesh.parent!==scene&&!mesh.parent.visible))continue;
          project(store,projection);raster(store);
        }
        context.putImageData(image,0,0);
      },
    };
  }
  function init(T, data) {
    const v = (x=0,y=0,z=0) => new T.Vector3(x,y,z);
    const X = v(1,0,0), Y = v(0,1,0), Z = v(0,0,1), down = v(0,-1,0);
    const byName = {}, origins = new Map();
    const bones = data.bones.map(([name,parent,head]) => {
      const bone = new T.Bone();
      bone.name = name;
      const anchor = v(...head);
      bone.position.copy(parent<0 ? anchor : anchor.sub(v(...data.bones[parent][2])));
      origins.set(bone,bone.position.clone());
      byName[name] = bone;
      return bone;
    });
    data.bones.forEach(([,parent],i) => {if(parent>=0)bones[parent].add(bones[i]);});
    const geom = new T.BufferGeometry();
    const positions = new Int16Array(bytes(data.positions).buffer);
    geom.setAttribute('position',new T.BufferAttribute(Float32Array.from(positions,n=>n/1000),3));
    geom.setAttribute('color',new T.BufferAttribute(bytes(data.colors),3,true));
    geom.setAttribute('skinIndex',new T.BufferAttribute(bytes(data.joints),4));
    geom.setAttribute('skinWeight',new T.BufferAttribute(bytes(data.weights),4,true));
    geom.setIndex(new T.BufferAttribute(new Uint16Array(bytes(data.triangles).buffer),1));
    geom.computeVertexNormals();
    const body = new T.SkinnedMesh(geom,new T.MeshStandardMaterial({vertexColors:true,roughness:.68}));
    body.frustumCulled=false;
    body.add(bones[0]);
    body.updateMatrixWorld(true);
    body.bind(new T.Skeleton(bones));
    const scene = new T.Scene();
    scene.add(body,new T.HemisphereLight(0xfff3e6,0x8b9aab,2.15));
    const key = new T.DirectionalLight(0xffebd9,2.35);
    key.position.set(-5,9,9);
    const fill = new T.DirectionalLight(0xe3edfa,1.25);
    fill.position.set(5,2,-6);
    scene.add(key,fill);

    const bench = new T.Mesh(new T.BoxGeometry(6,.43,4.1), new T.MeshStandardMaterial({color:0x929e9b,roughness:.92}));
    bench.position.set(0,-1.03,-1.28);
    scene.add(bench);
    const outline = new T.Shape();
    outline.moveTo(.67,.66); outline.bezierCurveTo(.41,.86,.03,.86,-.43,.84);
    outline.bezierCurveTo(-.59,.98,-.78,1.08,-.98,.96); outline.lineTo(-1.03,.73);
    outline.bezierCurveTo(-.78,.78,-.68,.62,-.67,.42);
    outline.bezierCurveTo(-.55,.22,-.42,-.12,-.27,-.42);
    outline.bezierCurveTo(-.16,-.69,-.04,-.93,.12,-1.05);
    outline.bezierCurveTo(.37,-.69,.57,-.09,.67,.66);
    const scapula = new T.Mesh(new T.ExtrudeGeometry(outline,{depth:.07,bevelEnabled:true,bevelThickness:.045,bevelSize:.04,bevelSegments:2}),
      new T.MeshStandardMaterial({color:0xe0c49d,roughness:.58,transparent:true,opacity:.94,side:T.DoubleSide}));
    const ridge = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([v(.58,.58,-.06),v(.14,.62,-.12),v(-.32,.72,-.10),v(-.9,.88,-.06)]),12,.06,6,false),
      new T.MeshStandardMaterial({color:0xf0d9b4,roughness:.62}));
    scapula.add(ridge);
    scene.add(scapula);
    const canvas = document.createElement('canvas');
    canvas.className='motion-3d-canvas';
    canvas.setAttribute('aria-hidden','true');
    const options={alpha:true,antialias:true,powerPreference:'low-power'};
    const gl=canvas.getContext('webgl2',options);
    const renderer=gl?new T.WebGLRenderer({...options,canvas,context:gl}):softwareRenderer(T,canvas,body,[bench,scapula,ridge]);
    if(gl) {
      renderer.setClearColor(0xffffff,0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.55));
      renderer.setSize(630,525,false);
    }
    const camera = new T.OrthographicCamera(-5,5,4,-4,.1,85);

    const bone = n => byName[n+'.R']||byName[n];
    const position = n => bone(n).getWorldPosition(v());
    function around(name,axis,angle) {
      if(!angle)return;
      const b = bone(name);
      const q = new T.Quaternion().setFromAxisAngle(axis,radians(angle));
      if (b.parent) {
        const parent = b.parent.getWorldQuaternion(new T.Quaternion());
        q.premultiply(parent.clone().invert()).multiply(parent);
      }
      b.quaternion.premultiply(q);
    }
    function aim(name,rest,direction) {
      const b = bone(name);
      const parent = b.parent.getWorldQuaternion(new T.Quaternion());
      const wanted = direction.clone().normalize().applyQuaternion(parent.clone().invert());
      const from = rest.clone().normalize().applyQuaternion(b.quaternion);
      b.quaternion.premultiply(new T.Quaternion().setFromUnitVectors(from,wanted));
    }
    function endpoint(name,tailName) {
      return v(...data.bones[bones.indexOf(bone(tailName))][2]).sub(v(...data.bones[bones.indexOf(bone(name))][2]));
    }
    const upper = endpoint('upperarm01','lowerarm01');
    // Educational surface regions on the rig; these are schematic, not segmented MRI anatomy.
    const deltoidAxis=upper.clone().normalize();
    const deltoidLateral=v(-1,0,0).projectOnPlane(deltoidAxis).normalize();
    const deltoidFront=v(0,0,1).projectOnPlane(deltoidAxis).normalize();
    const restShoulder=v(...data.bones[bones.indexOf(bone('upperarm01'))][2]);
    const originalColors=geom.attributes.color.array.slice();
    const deltoidRegions=[[],[],[]];
    for(let i=0;i<geom.attributes.position.count;i++){
      const p=v().fromBufferAttribute(geom.attributes.position,i).sub(restShoulder);
      const along=p.dot(deltoidAxis), radial=p.clone().addScaledVector(deltoidAxis,-along);
      if(along<-.38||along>upper.length()*.62||radial.length()<.22||radial.length()>.98)continue;
      const angle=Math.atan2(radial.dot(deltoidFront),radial.dot(deltoidLateral));
      if(Math.abs(angle)>Math.PI*.73)continue;
      deltoidRegions[angle>.48?0:angle<-.48?2:1].push(i);
    }
    let paintedDeltoid=null;
    function paintDeltoid(index){
      const selected=Number.isInteger(index)?index:null;
      if(selected===paintedDeltoid)return;
      const colors=geom.attributes.color.array;
      colors.set(originalColors);
      if(selected!==null)for(const i of deltoidRegions[selected]||[]){colors[i*3]=210;colors[i*3+1]=52;colors[i*3+2]=72;}
      geom.attributes.color.needsUpdate=true;
      paintedDeltoid=selected;
    }
    const lower = endpoint('lowerarm01','wrist');
    const thigh = endpoint('upperleg01','lowerleg01');
    const shin = endpoint('lowerleg01','foot');
    const hand = v(-.47,-1.15,1.25);
    const thumb = v(.39,-.45,1.12);
    const footTip = v(.14,-.55,1.91);
    function worldPoint(name,offset) {
      return bone(name).localToWorld(offset.clone());
    }
    function arm(upperDir,lowerDir=upperDir,handDir=lowerDir) {
      aim('upperarm01',upper,upperDir);
      aim('lowerarm01',lower,lowerDir);
      aim('wrist',hand,handDir);
    }
    function palm(direction,target) {
      const axis=direction.clone().normalize();
      const b=bone('wrist');
      const current=thumb.clone().applyQuaternion(b.getWorldQuaternion(new T.Quaternion())).projectOnPlane(axis).normalize();
      const desired=target.clone().projectOnPlane(axis).normalize();
      const angle=Math.atan2(axis.dot(v().crossVectors(current,desired)),current.dot(desired));
      around('wrist',axis,angle*180/Math.PI);
    }
    function leg(dir,kneeDir=dir) {
      aim('upperleg01',thigh,dir);
      aim('lowerleg01',shin,kneeDir);
    }
    const rotated = (vec,axis,angle) => vec.clone().applyAxisAngle(axis,radians(angle));
    const neutralLeg = v(-.12,-1,0).normalize();
    const neutralArm = v(-.09,-1,0).normalize();
    const neutralArmLeft = v(.09,-1,0);
    const leftUpper = endpoint('upperarm01.L','lowerarm01.L');
    const leftLower = endpoint('lowerarm01.L','wrist.L');
    const leftHand = v(.47,-1.15,1.25);
    function pose(kind, angle) {
      for (const b of bones) {b.position.copy(origins.get(b));b.quaternion.identity();}
      body.updateMatrixWorld(true);
      aim('upperarm01.L',leftUpper,neutralArmLeft);
      aim('lowerarm01.L',leftLower,neutralArmLeft);
      aim('wrist.L',leftHand,neutralArmLeft);
      arm(neutralArm);
      palm(neutralArm,Z);
      bench.visible=['hipTwist','kneeTwist','seatedAbduct'].includes(kind);
      scapula.visible=false;
      let pivot='upperarm01', tip=()=>worldPoint('wrist',hand.clone().normalize().multiplyScalar(1.15));
      if(kind==='shoulder'||kind==='abduct'||kind==='horizontal') {
        const lift=kind==='horizontal'?90:Math.max(0,angle);
        if(lift>22) {
          around('clavicle',Z,-Math.min(20,(lift-22)*.14));
          around('shoulder01',Y,-Math.min(12,(lift-22)*.09));
        }
        const dir=kind==='horizontal'?rotated(Z,Y,-angle):
          rotated(kind==='shoulder'?down:neutralArm,kind==='shoulder'?X:Z,-angle);
        arm(dir);
        palm(dir,kind==='abduct'?Z:kind==='horizontal'?Y:rotated(Z,X,-angle));
      } else if(kind==='shoulderTwist') {
        const dir=rotated(Z,Y,-angle);
        arm(neutralArm,dir);
        palm(dir,Y);
        tip=()=>position('wrist');
      } else if(['elevate','scapular','girdle'].includes(kind)) {
        const elevate=kind==='elevate'?angle:kind==='scapular'?angle*.009:0;
        const yaw=kind==='girdle'?angle:0;
        around('clavicle',Z,-elevate*24);
        around('clavicle',Y,yaw);
        around('shoulder01',Z,kind==='scapular'?-angle*.23:0);
        arm(kind==='scapular'?rotated(neutralArm,Z,-angle*2.4):neutralArm);
        palm(kind==='scapular'?rotated(neutralArm,Z,-angle*2.4):neutralArm,Z);
        const shoulder=position('upperarm01');
        scapula.position.set(shoulder.x+.4,shoulder.y-.68,-.84+yaw*.021);
        scapula.rotation.set(.08,yaw*.024,kind==='scapular'?-radians(angle):0);
        pivot='shoulder01';
        tip=()=>scapula.localToWorld(kind==='scapular'?v(.12,-1.05,0):v(-1,.8,0));
      } else if(kind==='elbow') {
        arm(neutralArm,rotated(down,X,-angle));
        palm(rotated(down,X,-angle),rotated(Z,X,-angle));
        pivot='lowerarm01';
      } else if(kind==='forearm'||kind.startsWith('wrist')) {
        const flex=kind==='wristFlex'?angle:0;
        const dev=kind==='wristSide'?angle:0;
        const dir=rotated(rotated(Z,X,flex),Y,dev);
        arm(neutralArm,Z,dir);
        if(kind==='forearm') {
          around('lowerarm01',Z,angle*.37);
          around('lowerarm02',Z,angle*.42);
          aim('wrist',hand,Z);
          palm(Z,rotated(Y,Z,angle));
          pivot='lowerarm01';
          tip=()=>worldPoint('wrist',thumb.clone().multiplyScalar(.62));
        } else {
          palm(dir,rotated(X,Y,dev));
          pivot='wrist';
        }
      } else if(kind==='hip'||kind==='hipSide') {
        leg(rotated(neutralLeg,kind==='hip'?X:Z,-angle));
        pivot='upperleg01';
        tip=()=>position('lowerleg01');
      } else if(kind==='knee') {
        leg(neutralLeg,rotated(down,X,angle));
        pivot='lowerleg01';tip=()=>position('foot');
      } else if(kind==='stance'){
        leg(v(0,-1,0));
        aim('upperleg01.L',endpoint('upperleg01.L','lowerleg01.L'),v(.02,-1,angle*.35));
        aim('lowerleg01.L',endpoint('lowerleg01.L','foot.L'),v(0,-1,-angle*.85));
        pivot='upperleg01';tip=()=>position('foot.L');
      } else if(['hipTwist','kneeTwist','seatedAbduct'].includes(kind)) {
        aim('upperleg01.L',endpoint('upperleg01.L','lowerleg01.L'),Z);
        aim('lowerleg01.L',endpoint('lowerleg01.L','foot.L'),down);
        leg(Z,down);
        arm(v(-.22,-1,.36),v(.18,-.62,.67));
        aim('upperarm01.L',leftUpper,v(.22,-1,.36));
        aim('lowerarm01.L',leftLower,v(-.18,-.62,.67));
        if(kind==='hipTwist')around('upperleg01',Z,angle);
        if(kind==='kneeTwist')around('lowerleg01',down,angle);
        if(kind==='seatedAbduct')leg(rotated(Z,Y,-angle),down);
        pivot=kind==='kneeTwist'?'lowerleg01':'upperleg01';
        tip=()=>kind==='kneeTwist'?worldPoint('foot',footTip):position(kind==='seatedAbduct'?'lowerleg01':'foot');
      } else if(kind==='ankle'||kind.startsWith('foot')) {
        leg(v(-.11,-1,.21),v(-.09,-1,.33));
        const f=bone('foot');
        const current=f.getWorldQuaternion(new T.Quaternion());
        f.quaternion.multiply(current.invert());
        if(kind==='ankle')around('foot',X,angle);
        else {
          around('foot',Z,angle);
          if(kind==='footCombo') {
            around('foot',Y,angle*.45);
            around('foot',X,angle*.6);
          }
        }
        pivot='foot';
        tip=()=>worldPoint('foot',kind==='ankle'?footTip:v(.43,-.48,1.3));
      } else if(kind.startsWith('neck')) {
        const axis={neckX:X,neckY:Y,neckZ:Z}[kind];
        for(const [name,share] of [['neck01',.28],['neck02',.26],['neck03',.24],['head',.22]])around(name,axis,angle*share);
        pivot='neck01';
        tip=()=>worldPoint('head',kind==='neckY'?v(0,.21,1.58):v(0,1.48,.52));
      } else if(kind.startsWith('spine')) {
        const axis={spineX:X,spineY:Y,spineZ:Z}[kind];
        const parts=kind==='spineY'?[.06,.12,.2,.28,.34]:[.17,.2,.21,.21,.21];
        ['spine05','spine04','spine03','spine02','spine01'].forEach((name,i)=>around(name,axis,angle*parts[i]));
        pivot='spine05';
        tip=()=>kind==='spineY'?position('upperarm01'):position('neck01');
      }
      scene.updateMatrixWorld(true);
      return {joint:position(pivot),tip:tip()};
    }

    let lastId=null, trace;
    function project(point) {
      const ndc=point.clone().project(camera);
      return [(ndc.x+1)*210,(1-ndc.y)*175];
    }
    // Schematic attachment lines in the model's coordinate system.
    const scapularFibers={
      trapUpper:[[[0,6.48,-.48],[-.94,.83,-.18]],[[0,6.2,-.65],[-.75,.83,-.18]]],
      trapMiddle:[[[0,5.17,-.77],[-.63,.66,-.18]],[[0,4.9,-.83],[-.35,.65,-.18]]],
      trapLower:[[[0,3.25,-.82],[-.62,.65,-.18]],[[0,3.68,-.84],[-.43,.69,-.18]]],
      rhomboidMinor:[[[0,5.22,-.83],[.46,.65,-.16]],[[0,5.07,-.83],[.41,.58,-.16]]],
      rhomboidMajor:[[[0,4.9,-.86],[.37,.43,-.16]],[[0,4.56,-.88],[.26,.14,-.16]],[[0,4.25,-.88],[.18,-.16,-.16]]],
      serratus:[[[-2.13,4.45,.05],[.49,.52,-.12]],[[-2.26,4.06,.09],[.4,.12,-.12]],[[-2.09,3.64,.12],[.18,-.52,-.12]],[[-1.86,3.39,.18],[.12,-.91,-.12]]],
    };
    function fiberRoutes(name) {
      if(scapularFibers[name])return scapularFibers[name].map(([start,end])=>[v(...start),scapula.localToWorld(v(...end))]);
      const ankle=worldPoint('foot',v(0,-.48,-.38));
      if(name==='gastrocnemius')return [-.28,.28].map(x=>[
        worldPoint('upperleg01',thigh.clone().add(v(x,.25,-.42))),
        worldPoint('lowerleg01',shin.clone().multiplyScalar(.38).add(v(x,-.01,-.58))),
        worldPoint('lowerleg01',shin.clone().multiplyScalar(.76).add(v(x*.5,0,-.34))),ankle,
      ]);
      if(name==='soleus')return [-.37,.38].map(x=>[
        worldPoint('lowerleg01',shin.clone().multiplyScalar(.22).add(v(x,0,-.36))),
        worldPoint('lowerleg01',shin.clone().multiplyScalar(.59).add(v(x,0,-.43))),
        worldPoint('lowerleg01',shin.clone().multiplyScalar(.84).add(v(x*.65,0,-.28))),ankle,
      ]);
      return [];
    }
    function fiberOverlay({primary,companions}) {
      const other=primary==='both'?['soleus']:companions?['trapUpper','trapLower','serratus'].filter(name=>name!==primary):[];
      const selected=primary==='both'?'gastrocnemius':primary;
      const lines=(name,color)=>fiberRoutes(name).map(points=>{
        const route=points.map(point=>project(point).map(n=>n.toFixed(1)).join(' ')).join('L');
        return '<path d="M'+route+'" fill="none" stroke="#fff8eb" stroke-width="5.8"/><path d="M'+route+'" fill="none" stroke="'+color+'" stroke-width="3.4"/>';
      }).join('');
      return '<g class="mf-fibers" stroke-linecap="round" stroke-linejoin="round">'+other.map(name=>lines(name,'#256592')).join('')+lines(selected,'#a1273c')+'</g>';
    }
    function draw(id,progress,mark,direction,svg,muscle) {
      const [defaultView,kind,start,finish]=definitions[id];
      const end=muscle?.otherSide?-finish:finish;
      const view=muscle&&id.startsWith('g-')?'muscleScapula':muscle&&id==='a-pf'?'muscleAnkle':defaultView;
      const cameraKey=id+'|'+view+'|'+end;
      const [focus,offset,height,title,left,right]=views[view];
      if(lastId!==cameraKey) {
        const center=v(...focus);
        camera.left=-height*.6;camera.right=height*.6;camera.top=height*.5;camera.bottom=-height*.5;
        camera.position.copy(center).addScaledVector(v(...offset).normalize(),27);
        camera.lookAt(center);camera.updateProjectionMatrix();camera.updateMatrixWorld();
        trace=Array.from({length:19},(_,i)=>project(pose(kind,blend(start,end,i/18)).tip));
        lastId=cameraKey;
      }
      const {joint,tip}=pose(kind,blend(start,end,progress));
      paintDeltoid(muscle?.deltoid);
      if(Number.isInteger(muscle?.deltoid)){
        const i=muscle.deltoid;
        const offset=upper.clone().multiplyScalar(.24).addScaledVector(deltoidLateral,.54).addScaledVector(deltoidFront,i===0?.36:i===2?-.36:0);
        const [mx,my]=project(worldPoint('upperarm01',offset));
        svg.dataset.muscleX=String(mx/420*100);svg.dataset.muscleY=String(my/350*100);
      }else{delete svg.dataset.muscleX;delete svg.dataset.muscleY;}
      scapula.visible=mark&&['elevate','scapular','girdle'].includes(kind);
      renderer.render(scene,camera);
      const [jx,jy]=project(joint);
      const [tx,ty]=project(tip);
      const route=trace.map(([x,y])=>x.toFixed(2)+' '+y.toFixed(2)).join('L');
      const [sx,sy]=trace[0];
      const line=direction?'<path d="M'+route+'" fill="none" stroke="#fdf8eb" stroke-width="5" stroke-linecap="round"/><path d="M'+route+'" fill="none" stroke="#a7452b" stroke-width="2.4" stroke-linecap="round" marker-end="url(#rb3-arrow)"/><circle cx="'+sx+'" cy="'+sy+'" r="3.5" fill="#fdf8eb" stroke="#a7452b" stroke-width="1.6"/><circle cx="'+tx+'" cy="'+ty+'" r="2.9" fill="#a7452b" stroke="#fff9eb" stroke-width="1.3"/>':'';
      const pin=mark?'<circle cx="'+jx+'" cy="'+jy+'" r="6.3" fill="#fff6e8" fill-opacity=".86" stroke="#087775" stroke-width="1.8"/><circle cx="'+jx+'" cy="'+jy+'" r="2.2" fill="#087775"/>':'';
      svg.innerHTML='<defs><marker id="rb3-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5 0 10 2 5Z" fill="#a7452b"/></marker></defs>'+
        (muscle?.primary?fiberOverlay(muscle):'')+line+pin+'<g fill="#314b51" stroke="#fffaf1" stroke-width="3.2" stroke-linejoin="round" paint-order="stroke fill" font-family="system-ui,sans-serif" font-weight="650"><text x="17" y="27" font-size="15">'+title+'</text><text x="17" y="53" font-size="12">'+left+'</text><text x="403" y="53" font-size="12" text-anchor="end">'+right+'</text></g>';
      return title;
    }
    const planeColors={sagittal:'#66b4ff',frontal:'#72dd9b',transverse:'#ff8184'};
    const planeDirections={
      sagittal:[X,Z,Y],
      frontal:[Z,X,Y],
      transverse:[Y,X,Z],
    };
    const planeNames={sagittal:'Sagittaal',frontal:'Frontaal',transverse:'Transversaal'};
    const axisNames={sagittal:'Transversale as',frontal:'Sagittale as',transverse:'Longitudinale as'};
    function drawLesson(svg,{plane,axis,motion,progress,yaw}) {
      lastId=null;
      const definition=definitions[motion];
      const {joint}=definition
        ?pose(definition[1],blend(definition[2],definition[3],progress))
        :pose('neutral',0);
      const center=v(0,.65,0);
      const angle=radians(yaw);
      camera.left=-12.3;camera.right=12.3;camera.top=10.25;camera.bottom=-10.25;
      camera.position.copy(center).addScaledVector(v(Math.sin(angle),.24,Math.cos(angle)),27);
      camera.lookAt(center);camera.updateProjectionMatrix();camera.updateMatrixWorld();
      renderer.render(scene,camera);
      const origin=definition?joint:v(0,.45,0);
      const screen=p=>{const q=p.clone().project(camera);return [(q.x+1)*315,(1-q.y)*262.5];};
      const coord=(point)=>screen(point).map(n=>n.toFixed(1));
      const planes=plane==='all'?Object.keys(planeDirections):plane?[plane]:[];
      const axes=axis==='all'?Object.keys(planeDirections):axis?[axis]:[];
      const localAxes={
        forearm:['wrist','Lengteas onderarm'],
        shoulderTwist:['lowerarm01','Lengteas bovenarm'],
        hipTwist:['lowerleg01','Lengteas bovenbeen'],
        kneeTwist:['foot','Lengteas onderbeen'],
      };
      const localAxis=localAxes[definition?.[1]];
      const polygons=planes.map(id=>{
        const [,u,w]=planeDirections[id];
        const vertical=id!=='transverse';
        const height=vertical?(definition?4.5:8.65):5.1;
        const width=definition?4.6:5.8;
        const pivot=origin;
        const points=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([i,j])=>
          coord(pivot.clone().addScaledVector(u,i*width).addScaledVector(w,j*height)).join(',')).join(' ');
        const [x,y]=coord(pivot.clone().addScaledVector(u,width*.88).addScaledVector(w,height*.84));
        return '<polygon points="'+points+'" fill="'+planeColors[id]+'" fill-opacity=".17" stroke="'+planeColors[id]+'" stroke-width="1.5"/>'+
          (planes.length===1?'<text x="'+x+'" y="'+y+'" text-anchor="end" fill="'+planeColors[id]+'">'+planeNames[id]+'</text>':'');
      }).join('');
      const lines=(localAxis?['local']:axes).map(id=>{
        const normal=localAxis?position(localAxis[0]).sub(origin).normalize():planeDirections[id][0];
        const length=definition?4.2:id==='transverse'?8.85:7.1;
        const [x1,y1]=coord(origin.clone().addScaledVector(normal,-length));
        const [x2,y2]=coord(origin.clone().addScaledVector(normal,length));
        const nearlyHeadOn=Math.hypot(x2-x1,y2-y1)<14;
        const point=nearlyHeadOn?'<circle cx="'+x2+'" cy="'+y2+'" r="7" fill="none" stroke="#ffdf82" stroke-width="2"/><circle cx="'+x2+'" cy="'+y2+'" r="2.5" fill="#ffdf82"/>':
          '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#ffdf82" stroke-width="2.3" stroke-dasharray="7 5" marker-start="url(#planes-arrow)" marker-end="url(#planes-arrow)"/>';
        return point+(axes.length===1||localAxis?'<text x="'+Math.max(120,Math.min(510,Number(x2)))+'" y="'+Math.max(24,Number(y2)-12)+'" text-anchor="middle" fill="#ffdf82">'+ (localAxis?localAxis[1]:axisNames[id])+'</text>':'');
      }).join('');
      const [x,y]=coord(origin);
      svg.innerHTML='<defs><marker id="planes-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5 0 10Z" fill="#ffdf82"/></marker></defs>'+
        '<g font-family="system-ui,sans-serif" font-size="17" font-weight="650" paint-order="stroke" stroke="#13222c" stroke-width="3" stroke-linejoin="round">'+polygons+lines+'</g>'+
        (definition?'<circle cx="'+x+'" cy="'+y+'" r="5" fill="#fff4c0" stroke="#13222c" stroke-width="2"/>':'');
    }
    return {canvas,draw,drawLesson};
  }

  function draw(svg,id,progress,mark,direction,onReady,muscle) {
    if(failed||!definitions[id]||!svg.getClientRects().length)return false;
    if(!engine) {
      if(!loading)prepare().then(onReady);
      return false;
    }
    try {
      const host=svg.parentElement;
      if(muscle){
        let canvas=host.querySelector('canvas');
        if(!canvas){
          canvas=document.createElement('canvas');
          canvas.setAttribute('aria-hidden','true');
          host.insertBefore(canvas,svg);
        }
        if(canvas.width!==engine.canvas.width||canvas.height!==engine.canvas.height){
          canvas.width=engine.canvas.width;
          canvas.height=engine.canvas.height;
        }
        engine.draw(id,progress,mark,direction,svg,muscle);
        const context=canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);
        context.drawImage(engine.canvas,0,0);
      }else{
        if(engine.canvas.parentElement!==host)host.insertBefore(engine.canvas,svg);
        engine.draw(id,progress,mark,direction,svg);
      }
      host.classList.add('motion-3d-active');
      return true;
    } catch {
      failed=true;
      if(muscle)svg.parentElement.querySelector('canvas')?.remove();
      else engine.canvas.remove();
      svg.parentElement.classList.remove('motion-3d-active');
      return false;
    }
  }
  function prepare() {
    if(!loading)loading=Promise.all([
      loadRenderer(),
      fetch(asset).then(r=>{if(!r.ok)throw Error('Model '+r.status);return r.json();}),
    ]).then(([,data])=>{engine=init(window.THREE,data);return true;})
      .catch(()=>{failed=true;return false;});
    return loading;
  }

  function drawLesson(svg,state) {
    if(failed||!engine)return false;
    const host=svg.parentElement;
    if(engine.canvas.parentElement!==host)host.insertBefore(engine.canvas,svg);
    try {
      engine.drawLesson(svg,state);
      return true;
    } catch {
      engine.canvas.remove();
      return false;
    }
  }

  window.rbMotion3d={ definitions,draw,prepare,drawLesson };
})();

