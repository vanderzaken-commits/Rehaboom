/* Original Rehaboom teaching geometry. Schematic joint mechanics, not scanned anatomy. */
(() => {
  const definitions = {
    'finger-pip':['detailHand','finger-pip',0,1],
    'finger-dip':['detailHand','finger-dip',0,1],
    'finger-ext':['detailHand','finger-ext',0,1],
    'thumb-abd':['detailThumb','thumb-abd',0,1],
    'thumb-ext':['detailThumb','thumb-ext',0,1],
    'toe-flex':['detailFoot','toe-flex',0,1],
    'toe-ext':['detailFoot','toe-ext',0,1],
    'hallux-flex':['detailFoot','hallux-flex',0,1],
    'hallux-ext':['detailFoot','hallux-ext',0,1],
    'rib-up':['detailRibs','rib-up',0,1],
    'rib-down':['detailRibs','rib-down',0,1],
    'rib-one':['detailRibs','rib-one',0,1],
    'rib-two':['detailRibs','rib-two',0,1],
    'abd-brace':['detailBrace','abd-brace',0,1],
  };
  function create(T) {
    const root=new T.Group(), meshes=[], digits=[], toes=[], ribs=[];
    const hand=new T.Group(), foot=new T.Group(), chest=new T.Group(), abdomen=new T.Group();
    root.add(hand,foot,chest,abdomen);
    const ivory=new T.MeshStandardMaterial({color:0xe5d0ad,roughness:.62});
    const coral=new T.MeshStandardMaterial({color:0xc6552f,roughness:.65});
    const blue=new T.MeshStandardMaterial({color:0x2e6f8c,roughness:.65});
    const cartilage=new T.MeshStandardMaterial({color:0x92aaa5,roughness:.5});
    const ball=new T.SphereGeometry(1,10,8);
    const shaft=new T.CylinderGeometry(1,1,1,10);
    const v=(...p)=>new T.Vector3(...p);
    function mesh(parent,geometry,material){
      const m=new T.Mesh(geometry,material);parent.add(m);meshes.push(m);return m;
    }
    function sphere(parent,p,r,material=ivory){const m=mesh(parent,ball,material);m.position.copy(p);m.scale.setScalar(r);return m;}
    function rod(parent,a,b,r,material=ivory){
      const m=mesh(parent,shaft,material),d=b.clone().sub(a);
      m.position.copy(a).add(b).multiplyScalar(.5);m.scale.set(r,d.length(),r);
      m.quaternion.setFromUnitVectors(v(0,1,0),d.normalize());return m;
    }
    function bone(parent,length,r,material=ivory){
      rod(parent,v(0,r*.6,0),v(0,length-r*.6,0),r*.63,material);
      sphere(parent,v(0,0,0),r,material);sphere(parent,v(0,length,0),r*.92,material);
    }
    function chain(parent,anchor,lengths,r,material=ivory){
      const joints=[];let node=parent;
      lengths.forEach((length,i)=>{
        const pivot=new T.Group();pivot.position.copy(i?v(0,lengths[i-1],0):anchor);
        node.add(pivot);bone(pivot,length,r*(1-i*.14),material);
        joints.push(pivot);node=pivot;
      });
      return {joints,tip:()=>node.localToWorld(v(0,lengths.at(-1),0))};
    }
    // Palmar view: thumb at the radial border, four articulated finger rays.
    const lengths=[[1.13,.76,.53],[1.3,.85,.57],[1.2,.79,.54],[.96,.64,.46]];
    for(let i=0;i<4;i++){
      const x=-.78+i*.52,y=.66+(i===1?.12:i===3?-.17:0);
      rod(hand,v(x*.45,-1.1,0),v(x,y,0),.14);
      digits.push(chain(hand,v(x,y,0),lengths[i],.17));
    }
    for(let row=0;row<2;row++)for(let i=0;i<4;i++)sphere(hand,v(-.52+i*.34,-1.02-row*.27,0),.2,cartilage);
    rod(hand,v(-.4,-2.15,0),v(-.4,-1.5,0),.19);
    rod(hand,v(.45,-2.15,0),v(.45,-1.5,0),.14);
    const thumb=chain(hand,v(-.75,-.65,0),[.83,.67,.51],.2);
    thumb.joints[0].rotation.z=.82;
    // Dorsal foot: metatarsals and individual hallux / lesser-toe joints.
    for(let i=0;i<5;i++){
      const x=-.85+i*.43, y=i===0?.55:.93-i*.13;
      rod(foot,v(x*.5,-1.5,0),v(x,y,0),i===0?.19:.13);
      toes.push(chain(foot,v(x,y,0),i===0?[.62,.46]:[.43-i*.025,.29,.23],i===0?.2:.13));
    }
    sphere(foot,v(0,-1.85,-.13),.52);sphere(foot,v(-.25,-1.25,.03),.35,cartilage);
    sphere(foot,v(.37,-1.15,.02),.31,cartilage);
    // Paired ribs rotate around posterior costovertebral anchors.
    rod(chest,v(0,-2.4,-.8),v(0,2.55,-.8),.16);
    rod(chest,v(0,.1,1.0),v(0,2.0,1.0),.13);
    for(let i=0;i<10;i++)for(const side of [-1,1]){
      const pivot=new T.Group(),width=1.1+Math.sin(i/10*Math.PI)*.7;
      pivot.position.set(0,2.3-i*.46,-.8);chest.add(pivot);
      const points=[v(side*.12,0,0),v(side*width,-.13,.45),v(side*width,-.3,1.25),v(side*.14,-.4,1.8)];
      const m=mesh(pivot,new T.TubeGeometry(new T.CatmullRomCurve3(points),18,.065,6,false),ivory);
      ribs.push({pivot,i,side,mesh:m});
    }
    const wall=mesh(abdomen,new T.SphereGeometry(1,24,16),blue);wall.scale.set(1.3,1.7,.75);
    const bands=[];
    for(let i=0;i<9;i++){
      const y=-1.2+i*.3,r=Math.sqrt(1-(y/1.8)**2);
      const points=Array.from({length:33},(_,j)=>{const a=j/32*Math.PI*2;return v(Math.cos(a)*1.34*r,y,Math.sin(a)*.79*r);});
      bands.push(mesh(abdomen,new T.TubeGeometry(new T.CatmullRomCurve3(points),32,.035,5,false),coral));
    }
    function pose(id,p){
      hand.visible=id.startsWith('finger')||id.startsWith('thumb');
      foot.visible=id.startsWith('toe')||id.startsWith('hallux');
      chest.visible=id.startsWith('rib');abdomen.visible=id==='abd-brace';
      root.visible=true;
      let joint=v(),tip=v(0,1,0);
      if(hand.visible){
        digits.forEach(d=>d.joints.forEach(j=>j.rotation.set(0,0,0)));
        thumb.joints.forEach(j=>j.rotation.set(0,0,0));thumb.joints[0].rotation.z=.82;
        digits.forEach(d=>{
          const angles=id==='finger-pip'?[0,85*p,25*p]:id==='finger-dip'?[0,0,75*p]:id==='finger-ext'?[42*(1-p),55*(1-p),25*(1-p)]:[0,0,0];
          d.joints.forEach((j,i)=>j.rotation.x=angles[i]*Math.PI/180);
        });
        if(id==='thumb-abd')thumb.joints[0].rotation.z=.55+.6*p;
        if(id==='thumb-ext')thumb.joints[2].rotation.x=.8*(1-p);
        root.updateMatrixWorld(true);
        const chain=id.startsWith('thumb')?thumb:digits[1];
        joint=chain.joints[id==='finger-dip'||id==='thumb-ext'?2:id==='finger-pip'?1:0].getWorldPosition(v());tip=chain.tip();
      }else if(foot.visible){
        const hallux=id.startsWith('hallux'),extension=id.endsWith('ext');
        toes.forEach((d,i)=>d.joints.forEach((j,k)=>{
          const active=hallux?i===0:i>0;
          j.rotation.x=active?(extension?1:-1)*p*(k===0?.65:.45):0;
        }));
        root.updateMatrixWorld(true);const d=toes[hallux?0:1];joint=d.joints[0].getWorldPosition(v());tip=d.tip();
      }else if(chest.visible){
        ribs.forEach(({pivot,i,side,mesh:m})=>{
          const active=id==='rib-one'?i===0:id==='rib-two'?i===1:true;
          const phase=id==='rib-down'?1-p:p;
          pivot.rotation.set(active?-.12*phase:0,0,active?side*.07*phase:0);
          m.material=active?coral:ivory;
        });
        root.updateMatrixWorld(true);const r=ribs[id==='rib-two'?3:1];joint=r.pivot.getWorldPosition(v());tip=r.pivot.localToWorld(v(1.35,-.4,1.1));
      }else{
        wall.scale.x=1.3*(1-p*.1);wall.scale.z=.75*(1-p*.1);
        bands.forEach(m=>m.scale.set(1-p*.1,1,1-p*.1));
        root.updateMatrixWorld(true);joint=v(0,0,0);tip=v(1.34*(1-p*.1),0,0);
      }
      return {joint,tip};
    }
    root.visible=false;
    return {root,meshes,pose};
  }
  window.rbMotionDetails={definitions,create};
})();
  
