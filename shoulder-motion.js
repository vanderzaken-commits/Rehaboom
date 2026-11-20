/* Illustrated teaching poses. The slider represents progress through the demonstration. */
(() => {
  const moves = {
    's-ante': ['side', 0, 170, 'De arm gaat voor de romp omhoog. Het schouderblad draait mee.'],
    's-retro': ['side', 0, -45, 'De bovenarm gaat achter de romp. De romp blijft rechtop.'],
    's-abd': ['front', 0, 170, 'De arm gaat zijwaarts omhoog. Het schouderblad draait mee.'],
    's-add': ['front', 95, 0, 'De geheven arm keert zijwaarts terug tot naast de romp.'],
    's-endo': ['axial', 0, -60, 'De elleboog blijft naast de romp. De onderarm draait richting de buik.'],
    's-exo': ['axial', 0, 65, 'De elleboog blijft naast de romp. De onderarm draait naar buiten.'],
    's-habd': ['horizontal', 0, 105, 'De arm blijft op schouderhoogte en gaat van voren naar opzij.'],
    's-hadd': ['horizontal', 90, -25, 'De arm blijft op schouderhoogte en gaat richting de borst.'],
    'g-elev': ['back', 0, -22, 'Het schouderblad en het buitenste uiteinde van het sleutelbeen gaan omhoog.'],
    'g-depr': ['back', 0, 14, 'Het schouderblad en het buitenste uiteinde van het sleutelbeen zakken.'],
    'g-urot': ['back', 0, -53, 'De onderste punt gaat naar buiten. De gewrichtskom draait omhoog.'],
    'g-drot': ['back', -53, 0, 'De onderste punt keert naar binnen. De gewrichtskom draait omlaag.'],
    'g-prot': ['scapulaTop', 0, -26, 'Het schouderblad volgt de ribbenkast naar buiten en naar voren.'],
    'g-retr': ['scapulaTop', 0, 18, 'Het schouderblad schuift richting de wervelkolom.'],
  };
  const captions = {
    side:'Zijaanzicht · rechterarm', front:'Vooraanzicht · rechterarm',
    back:'Achteraanzicht · rechter schouderblad', axial:'Bovenaanzicht · elleboog 90° gebogen',
    horizontal:'Bovenaanzicht · arm op schouderhoogte', scapulaTop:'Bovenaanzicht · rechter schouderblad',
  };
  const rad = angle => angle * Math.PI / 180;
  const xy = ([x,y]) => x.toFixed(1) + ' ' + y.toFixed(1);
  const rotation = (angle, center) => 'rotate(' + angle + (center ? ' ' + xy(center) : '') + ')';
  const translation = p => 'translate(' + xy(p) + ')';
  function turn([x,y], [cx,cy], angle) {
    const c = Math.cos(rad(angle)), s = Math.sin(rad(angle));
    return [cx + (x-cx)*c - (y-cy)*s, cy + (x-cx)*s + (y-cy)*c];
  }
  const group = (content, transform = '', opacity = 1) =>
    '<g transform="' + transform + '" opacity="' + opacity + '">' + content + '</g>';
  const path = (d, fill, stroke, width, extra = '') =>
    '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + width + '" stroke-linecap="round" stroke-linejoin="round" ' + extra + '/>';
  const skin = d => path(d, 'url(#rb-skin)', '#997464', 1.4);
  const bone = d => path(d, 'url(#rb-bone)', '#846751', 1.25);
  const detail = d => path(d, 'none', '#967054', 1.4, 'opacity=".64"');
  const guide = d => path(d, 'none', '#506b72', 1.7, 'stroke-dasharray="4 5" opacity=".7"');
  const paper = '<defs>' +
    '<linearGradient id="rb-paper" x2="1" y2="1"><stop stop-color="#fffaf3"/><stop offset="1" stop-color="#e1ebe6"/></linearGradient>' +
    '<linearGradient id="rb-skin"><stop stop-color="#b88371"/><stop offset=".46" stop-color="#efd1b7"/><stop offset="1" stop-color="#c18f7a"/></linearGradient>' +
    '<linearGradient id="rb-bone"><stop stop-color="#b79a76"/><stop offset=".37" stop-color="#fff5db"/><stop offset=".79" stop-color="#dec19e"/><stop offset="1" stop-color="#9e805f"/></linearGradient>' +
    '<marker id="rb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5 0 10 2 5Z" fill="#993d27"/></marker>' +
    '</defs><rect width="420" height="350" fill="url(#rb-paper)"/>';
  const blade = 'M-34 -8Q-26 -17 -16 -12L-4 -15Q3 -23 11 -20Q15 -17 10 -13L7 -11Q13 -12 17 -7L16 -2Q12 -5 7 -2Q10 4 7 11Q4 16 2 13Q-5 25 -11 33Q-14 40 -18 35Q-29 19 -36 -6Z';
  const collar = 'M0 -3C15 -5 25 1 43 -1L58 -3Q62 -2 61 1Q58 5 52 4C32 7 18 0 2 3Q-2 2 0 -3Z';
  const upper = 'M-9 -12C-20 -9 -22 4 -20 17C-17 33 -13 49 -12 62Q-10 72 -4 74L7 74Q11 70 11 60C12 47 14 32 17 20Q22 4 12 -7Q4 -14 -9 -12Z';
  const lower = 'M-9 60Q-14 66 -12 79C-10 96 -7 111 -6 121L-10 130Q-12 134 -8 135L-4 132L-5 144Q-5 149 -2 147L0 139L1 149Q3 153 5 149L6 139L7 146Q9 149 11 145L12 132Q12 125 8 120C9 105 12 89 12 77Q12 67 8 63Z';
  const humerus = 'M-7 -9Q3 -15 10 -6Q16 2 9 9Q4 14 4 25L4 52Q5 58 9 64Q10 72 4 72Q0 70 -3 72Q-8 71 -8 66Q-4 57 -4 52V26Q-4 17 -9 8Q-14 -2 -7 -9Z';
  const forearmBones = 'M-8 68Q-6 64 -3 68L-2 79L-2 113Q-1 119 -3 124L-7 124Q-9 121 -7 116L-7 83Z M3 69Q7 67 8 71L7 85L5 112Q8 121 5 125L0 124Q-1 121 1 115L2 84Z';
  function drawArm(p, a, anatomy, bent = false) {
    const outer = bent ? skin(lower) : skin(upper) + skin(lower);
    const inner = (bent ? '' : bone(humerus)) + bone(forearmBones);
    return group(group(group(outer, '', anatomy ? .67 : 1) + (anatomy ? inner : ''),
      bent ? 'translate(0 -65)' : ''), translation(p) + rotation(a));
  }
  function drawBlade(p, a) {
    return group(bone(blade) + detail('M-30 -6Q-13 2 4 -11M-27 6Q-13 10 2 5M-23 12L-17 28M8 -4Q11 0 7 7'),
      translation(p) + rotation(a));
  }
  function drawCollar(from, to) {
    const dx = to[0] - from[0], dy = to[1] - from[1];
    return group(bone(collar), translation(from) + rotation(Math.atan2(dy,dx)*180/Math.PI) +
      'scale(' + Math.hypot(dx,dy)/61 + ' 1)');
  }
  function ribs(origin, side) {
    const arc = side ? 'q19 19 53 6' : 'q35 14 59 -1';
    const ribsHalf = [0,13,26,39,52].map(y => path('M0 ' + y + arc,'none','#a78669',2.6)).join('');
    return group(ribsHalf + (side ? '' : group(ribsHalf,'scale(-1 1)') + detail('M0 -5v62')),
      translation(origin), .53);
  }
  function torso(view, anatomy) {
    if (view === 'side') {
      return skin('M171 147Q185 151 201 145C208 151 215 161 219 176C229 193 220 210 215 220C207 243 213 269 219 309H144Q145 279 146 258C149 231 142 205 148 184Q151 160 171 147Z') +
        skin('M186 64C167 67 157 83 159 104C159 122 168 132 173 144L171 157Q186 166 202 155L200 134Q216 130 216 119L223 115Q226 113 220 108L215 101C215 79 205 65 186 64Z') +
        detail('M194 100Q200 96 203 102Q205 108 199 111M205 114L216 114M193 135Q185 141 173 143') +
        (anatomy ? ribs([150,178],true) : '');
    }
    if (view === 'front' || view === 'back') {
      const outline = skin('M170 124H192Q200 137 216 140Q231 142 241 153C248 165 244 184 240 202L233 227Q231 255 244 304Q212 313 180 308Q148 313 116 304Q129 254 128 226L120 198Q113 177 119 158Q127 143 151 139Q162 136 170 124Z') +
        skin('M154 72C154 55 168 47 181 47C198 47 208 58 208 75L206 93Q203 112 190 121L190 134H172L172 121Q159 112 156 94Z');
      const landmarks = view === 'front' ? 'M169 86h6m13 0h6m-13 1l-3 13h5m-9 8q8 4 14 0M151 147q21 7 30 20q11 -13 28 -20' : 'M171 112q11 5 20 0M181 143v151';
      return group(outline + detail(landmarks) + (anatomy ? ribs([181,169],false) : ''),
        view === 'back' ? 'translate(15 2)' : '');
    }
    return '<ellipse cx="192" cy="193" rx="85" ry="61" fill="url(#rb-skin)" stroke="#926e5e" stroke-width="1.4"/>' +
      (anatomy ? '<ellipse cx="192" cy="194" rx="72" ry="49" fill="none" stroke="#b18a6b" stroke-width="4" opacity=".65"/>' : '') +
      skin('M176 183Q177 165 192 163Q208 167 208 183Q210 204 192 215Q174 207 176 183Z') + detail('M188 167Q192 160 197 167');
  }
  function label(x, y, text, anchor = 'start', size = 12) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" fill="#314b51" font-size="' + size +
      '" font-weight="650" font-family="system-ui, sans-serif">' + text + '</text>';
  }
  function arrow(sample) {
    const points = Array.from({length:21}, (_, i) => sample(i/20));
    const d = 'M' + points.map(xy).join('L');
    return path(d,'none','#fff8eb',6) + path(d,'none','#993d27',2.6,'marker-end="url(#rb-arrow)"') +
      '<circle cx="' + points[0][0] + '" cy="' + points[0][1] + '" r="4" fill="#fff8eb" stroke="#993d27" stroke-width="1.8"/>';
  }
  function render(id, progress, anatomy, showDirection) {
    const [view,start,end] = moves[id];
    const at = t => start + (end-start)*t;
    const value = at(progress);
    let drawing = torso(view, anatomy), begin, track;
    let labels = label(18,27,captions[view],'start',15);
    if (view === 'side' || view === 'front') {
      const side = view === 'side';
      const joint = side ? [198,168] : [239,151];
      const pose = t => {
        const angle = at(t);
        const lift = Math.max(0,angle-25)/145;
        return {p:[joint[0]+7*lift,joint[1]-10*lift], a:-angle-(side ? 0 : 5), blade:-50*lift};
      };
      const {p,a,blade:bladeAngle} = pose(progress);
      const tip = ({p,a}, r) => turn([p[0],p[1]+r],p,a);
      if (!side) drawing += group(drawArm([122,151],7,false),'',.55);
      if (anatomy) drawing += drawBlade([p[0]-13,p[1]+3],bladeAngle) +
        group(drawCollar(side ? [p[0]-40,p[1]-16] : [181,155],[p[0]-2,p[1]-5]),'',.8);
      drawing += drawArm(p,a,anatomy);
      begin = guide('M' + xy(pose(0).p) + 'L' + xy(tip(pose(0),136)));
      track = t => tip(pose(t),156);
      labels += side ? label(19,57,'Achter') + label(400,57,'Voor','end') : label(20,56,'Rechterzijde');
    } else if (view === 'back') {
      const sliding = id === 'g-elev' || id === 'g-depr';
      const pivot = [225,168], neutralJoint = [257,165];
      const point = (p,a) => sliding ? [p[0],p[1]+a] : turn(p,pivot,a);
      const joint = point(neutralJoint,value);
      const movingBlade = point([246,174],value);
      drawing += group(drawArm([139,157],6,false) +
        (anatomy ? group(drawBlade([246,174],0),'translate(390 0) scale(-1 1)') : ''),'',.46);
      drawing += group(drawArm(joint,sliding ? -6 : -6+value*2.1,anatomy),'',sliding ? 1 : .72);
      if (anatomy) drawing += group(drawCollar([196,150],joint),'',.75) +
        drawBlade(movingBlade,sliding ? 0 : value);
      const landmark = sliding ? [291,166] : [228,221];
      begin = guide('M' + xy(point(landmark,start)) + 'l-18 0');
      track = t => point(landmark,at(t));
      labels += label(400,56,'Rechterzijde','end');
    } else {
      labels += label(192,57,'Voor','middle') + label(192,328,'Achter','middle');
      if (view === 'scapulaTop') {
        const center = [192,194], edge = [247,225];
        const place = a => turn(edge,center,a);
        const current = place(value);
        const acromion = turn([265,207],center,value);
        drawing += group(drawCollar([196,145],acromion),'',.82) +
          group(bone('M-22 4Q-9 -5 14 -6L24 -11Q29 -9 27 -4L18 3Q3 7 -21 9Z') +
            detail('M-18 6Q0 2 22 -5'),translation(current) + rotation(value-20),anatomy ? 1 : .47);
        begin = guide('M' + xy(place(start)) + 'l15 -4');
        track = t => turn([285,250],center,at(t));
      } else {
        const bent = view === 'axial';
        const joint = bent ? [266,193] : [268,183];
        const position = t => 180+at(t);
        if (bent) drawing += '<ellipse cx="266" cy="193" rx="19" ry="18" fill="url(#rb-skin)" stroke="#926e5e"/>';
        const scale = bent ? .74 : .82;
        drawing += group(drawArm([0,0],0,anatomy,bent),translation(joint)+rotation(position(progress))+'scale('+scale+')');
        const trace = (t,r) => turn([joint[0],joint[1]+r],joint,position(t));
        begin = guide('M'+xy(joint)+'L'+xy(trace(0,bent ? 61 : 119)));
        track = t => trace(t,bent ? 73 : 135);
      }
    }
    const diagram = drawing + (showDirection ? begin + arrow(track) : '');
    const frame = view === 'front' ? 'translate(391 62) scale(-.84 .84)' : view === 'side' ? 'translate(29 62) scale(.84)' : '';
    return paper + group(diagram,frame) + labels;
  }
  window.rbShoulderMotion = { moves, render };
})();
