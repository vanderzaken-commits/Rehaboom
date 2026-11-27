/* Shared, independent camera and playback settings for every movement viewer. */
(() => {
  const states=new WeakMap();
  const initial=()=>({yaw:0,pitch:0,zoom:1,axis:false,speed:1,repeat:false});
  function state(svg){if(!states.has(svg))states.set(svg,initial());return states.get(svg);}
  function markup(){return `<details class="rb-motion-tools"><summary>3D-beeld en afspelen</summary>
    <div class="rb-motion-grid">
      <label>Rond het model draaien<input data-rb-view="yaw" type="range" min="-180" max="180" step="5" value="0" aria-label="Rond het 3D-model draaien"></label>
      <label>Van boven of onder kijken<input data-rb-view="pitch" type="range" min="-40" max="40" step="5" value="0" aria-label="Kijkhoogte 3D-model"></label>
      <label>Zoomen<input data-rb-view="zoom" type="range" min="0.7" max="1.8" step="0.1" value="1" aria-label="Zoomen op 3D-model"></label>
      <label>Afspeelsnelheid<select data-rb-view="speed"><option value="0.25">0,25× · zeer langzaam</option><option value="0.5">0,5× · langzaam</option><option value="1" selected>1× · normaal</option><option value="1.5">1,5× · snel</option></select></label>
    </div><div class="rb-motion-toggles"><label><input type="checkbox" data-rb-view="repeat">Heen en terug herhalen</label>
      <label><input type="checkbox" data-rb-view="axis">Rotatie-as tonen</label>
      <button type="button" data-rb-view-reset>Herstel kijkhoek</button>
    </div><p class="rb-motion-hint">Sleep horizontaal over het model om te draaien. De schuifregelaars werken ook met het toetsenbord.</p></details>`;}
  function mount(scope,svg,redraw){
    if(!scope||scope.dataset.rbMounted)return state(svg);
    scope.dataset.rbMounted='true';
    const current=state(svg);
    const sync=()=>scope.querySelectorAll('[data-rb-view]').forEach(input=>{
      const value=current[input.dataset.rbView];
      if(input.type==='checkbox')input.checked=value;else input.value=String(value);
    });
    scope.addEventListener('input',event=>{
      const input=event.target.closest('[data-rb-view]');if(!input)return;
      current[input.dataset.rbView]=input.type==='checkbox'?input.checked:Number(input.value);
      redraw();
    });
    scope.querySelector('[data-rb-view-reset]')?.addEventListener('click',()=>{
      Object.assign(current,{yaw:0,pitch:0,zoom:1});sync();redraw();
    });
    const stage=svg.parentElement;
    let drag=null;
    stage.addEventListener('pointerdown',event=>{
      if(event.button!==0||event.target.closest('button'))return;
      drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw:current.yaw};
    });
    stage.addEventListener('pointermove',event=>{
      if(!drag||event.pointerId!==drag.id)return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(Math.abs(dx)<8||Math.abs(dy)>Math.abs(dx))return;
      stage.setPointerCapture?.(event.pointerId);
      current.yaw=((drag.yaw+dx*.55+540)%360)-180;sync();redraw();
    });
    for(const name of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(name,()=>{drag=null;});
    sync();return current;
  }
  // Time based playback: no jump when speed changes, and no large leap after backgrounding.
  function advance(progress,direction,elapsed,settings){
    let next=progress+direction*Math.min(100,Math.max(0,elapsed))/1800*settings.speed;
    if(next>=1)return settings.repeat?{progress:2-next,direction:-1,done:false}:{progress:1,direction:1,done:true};
    if(next<=0&&direction<0)return {progress:-next,direction:1,done:!settings.repeat};
    return {progress:next,direction,done:false};
  }
  window.rbMotionControls={state,markup,mount,advance};
})();
  
