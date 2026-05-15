# **19.3 Wave Nature of Particles**

|       | Learning Outcome |
| ----- | ---------------- |
| 19(d) | explain how electron diffraction and single-particle double-slit interference support the wave nature of particles |

## **Electron Diffraction**

Electron diffraction is observed when a beam of electrons passes through a thin crystalline material. The electrons form a diffraction pattern, often seen as rings.

This is evidence that electrons have wave behaviour, because diffraction is a wave phenomenon.

<div style="max-width:760px;margin:1rem 0;border:1px solid #dde3ea;border-radius:8px;overflow:hidden;background:#fff;">
<svg viewBox="0 0 760 280" role="img" aria-label="Electron diffraction rings" style="display:block;width:100%;height:auto;">
  <rect width="760" height="280" fill="#ffffff"/>
  <text x="28" y="38" font-size="20" font-weight="700" fill="#111827">Electron diffraction</text>
  <line x1="70" y1="142" x2="235" y2="142" stroke="#2563eb" stroke-width="4" marker-end="url(#arrow19_3)"/>
  <rect x="250" y="70" width="18" height="145" fill="#374151"/>
  <text x="226" y="236" font-size="15" fill="#374151">crystal</text>
  <circle cx="560" cy="142" r="24" fill="none" stroke="#f59e0b" stroke-width="5"/>
  <circle cx="560" cy="142" r="60" fill="none" stroke="#f59e0b" stroke-width="4"/>
  <circle cx="560" cy="142" r="96" fill="none" stroke="#f59e0b" stroke-width="3"/>
  <circle cx="560" cy="142" r="5" fill="#111827"/>
  <text x="480" y="260" font-size="15" fill="#374151">rings show diffraction</text>
  <defs>
    <marker id="arrow19_3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
    </marker>
  </defs>
</svg>
</div>

## **Single-Particle Double-Slit Interference**

In a double-slit experiment, particles can be sent one at a time. Each particle is detected at one point on the screen, but after many particles have arrived, an interference pattern builds up.

This shows two important ideas:

- each detection event is particle-like
- the probability distribution follows a wave-like interference pattern

<div style="max-width:760px;margin:1rem 0;border:1px solid #dde3ea;border-radius:8px;overflow:hidden;background:#fff;">
<svg viewBox="0 0 760 360" role="img" aria-label="Many individual electrons pass through a double slit and build up an interference fringe pattern on a screen" style="display:block;width:100%;height:auto;">
  <rect width="760" height="360" fill="#ffffff"/>
  <text x="28" y="38" font-size="20" font-weight="700" fill="#111827">Single-particle double-slit interference</text>
  <text x="28" y="62" font-size="14" fill="#374151">Individual electron hits accumulate into a wave-like probability pattern.</text>
  <defs>
    <radialGradient id="electron-dot-gradient" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#dbeafe"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </radialGradient>
    <style>
      .sp-label { font: 700 14px Roboto, Arial, sans-serif; fill: #111827; }
      .sp-small { font: 12px Roboto, Arial, sans-serif; fill: #374151; }
      .electron-dot { fill: url(#electron-dot-gradient); stroke: #1e3a8a; stroke-width: 0.7; }
      .screen-hit { fill: #f59e0b; stroke: #92400e; stroke-width: 0.55; }
    </style>
  </defs>

  <g aria-label="Electron source and individual incoming electrons">
    <circle cx="58" cy="178" r="24" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <circle cx="58" cy="178" r="8" fill="#2563eb"/>
    <text class="sp-small" x="35" y="220">source</text>
    <text class="sp-small" x="28" y="240">electrons</text>
    <circle class="electron-dot" cx="101" cy="154" r="3.3"/>
    <circle class="electron-dot" cx="116" cy="177" r="3.3"/>
    <circle class="electron-dot" cx="132" cy="203" r="3.3"/>
    <circle class="electron-dot" cx="146" cy="165" r="3.3"/>
    <circle class="electron-dot" cx="158" cy="190" r="3.3"/>
    <circle class="electron-dot" cx="176" cy="176" r="3.3"/>
    <circle class="electron-dot" cx="190" cy="210" r="3.3"/>
  </g>

  <g aria-label="Double slit barrier">
    <rect x="228" y="82" width="18" height="92" rx="2" fill="#111827"/>
    <rect x="228" y="198" width="18" height="92" rx="2" fill="#111827"/>
    <rect x="226" y="174" width="22" height="24" fill="#ffffff"/>
    <rect x="226" y="150" width="22" height="24" fill="#ffffff"/>
    <text class="sp-small" x="209" y="316">double slit</text>
  </g>

  <g aria-label="Faint wave-like probability envelope">
    <path d="M248 162 C355 95 485 86 662 118 L662 142 C486 127 358 130 248 178 Z" fill="#dbeafe" opacity="0.42"/>
    <path d="M248 186 C360 160 496 151 662 160 L662 190 C496 199 360 194 248 186 Z" fill="#bfdbfe" opacity="0.6"/>
    <path d="M248 186 C355 257 485 269 662 236 L662 212 C486 227 358 218 248 170 Z" fill="#dbeafe" opacity="0.42"/>
    <path d="M248 156 C365 54 505 48 662 72 L662 88 C500 80 372 100 248 164 Z" fill="#eff6ff" opacity="0.55"/>
    <path d="M248 194 C365 306 505 310 662 286 L662 270 C500 278 372 250 248 184 Z" fill="#eff6ff" opacity="0.55"/>
  </g>

  <g aria-label="Individual electrons after the double slit">
    <circle class="electron-dot" cx="282" cy="157" r="3.2"/>
    <circle class="electron-dot" cx="292" cy="196" r="3.2"/>
    <circle class="electron-dot" cx="318" cy="128" r="3.1"/>
    <circle class="electron-dot" cx="326" cy="176" r="3.1"/>
    <circle class="electron-dot" cx="340" cy="222" r="3.1"/>
    <circle class="electron-dot" cx="369" cy="107" r="3"/>
    <circle class="electron-dot" cx="376" cy="166" r="3"/>
    <circle class="electron-dot" cx="389" cy="191" r="3"/>
    <circle class="electron-dot" cx="402" cy="247" r="3"/>
    <circle class="electron-dot" cx="430" cy="84" r="2.9"/>
    <circle class="electron-dot" cx="438" cy="136" r="2.9"/>
    <circle class="electron-dot" cx="448" cy="178" r="2.9"/>
    <circle class="electron-dot" cx="460" cy="210" r="2.9"/>
    <circle class="electron-dot" cx="474" cy="270" r="2.9"/>
    <circle class="electron-dot" cx="505" cy="96" r="2.8"/>
    <circle class="electron-dot" cx="515" cy="145" r="2.8"/>
    <circle class="electron-dot" cx="526" cy="176" r="2.8"/>
    <circle class="electron-dot" cx="536" cy="202" r="2.8"/>
    <circle class="electron-dot" cx="548" cy="244" r="2.8"/>
    <circle class="electron-dot" cx="586" cy="117" r="2.7"/>
    <circle class="electron-dot" cx="594" cy="159" r="2.7"/>
    <circle class="electron-dot" cx="604" cy="183" r="2.7"/>
    <circle class="electron-dot" cx="614" cy="231" r="2.7"/>
  </g>

  <g aria-label="Detection screen with many individual hits arranged as interference fringes">
    <rect x="680" y="62" width="36" height="242" rx="4" fill="#111827"/>
    <g>
      <circle class="screen-hit" cx="689" cy="78" r="2.2"/><circle class="screen-hit" cx="701" cy="84" r="2.2"/><circle class="screen-hit" cx="693" cy="91" r="2.2"/>
      <circle class="screen-hit" cx="688" cy="112" r="2.4"/><circle class="screen-hit" cx="699" cy="117" r="2.4"/><circle class="screen-hit" cx="707" cy="124" r="2.4"/><circle class="screen-hit" cx="692" cy="130" r="2.4"/><circle class="screen-hit" cx="703" cy="135" r="2.4"/>
      <circle class="screen-hit" cx="687" cy="158" r="2.7"/><circle class="screen-hit" cx="696" cy="154" r="2.7"/><circle class="screen-hit" cx="706" cy="160" r="2.7"/><circle class="screen-hit" cx="691" cy="168" r="2.7"/><circle class="screen-hit" cx="701" cy="171" r="2.7"/><circle class="screen-hit" cx="710" cy="176" r="2.7"/><circle class="screen-hit" cx="688" cy="181" r="2.7"/><circle class="screen-hit" cx="697" cy="187" r="2.7"/><circle class="screen-hit" cx="706" cy="190" r="2.7"/>
      <circle class="screen-hit" cx="689" cy="213" r="2.4"/><circle class="screen-hit" cx="700" cy="219" r="2.4"/><circle class="screen-hit" cx="709" cy="226" r="2.4"/><circle class="screen-hit" cx="693" cy="232" r="2.4"/><circle class="screen-hit" cx="704" cy="237" r="2.4"/>
      <circle class="screen-hit" cx="690" cy="266" r="2.2"/><circle class="screen-hit" cx="702" cy="271" r="2.2"/><circle class="screen-hit" cx="694" cy="282" r="2.2"/>
    </g>
    <text class="sp-small" x="677" y="328">screen</text>
  </g>

  <g aria-label="Summary labels">
    <text class="sp-label" x="85" y="326">separate electrons</text>
    <text class="sp-label" x="424" y="326">spread-out probability</text>
    <text class="sp-label" x="566" y="328">single hits build fringes</text>
  </g>
</svg>
</div>

## **Why Particles Are Not Simply Classical Particles**

A classical particle would pass through one slit and produce two broad bands, one behind each slit. It would not produce alternating bright and dark interference fringes.

For electrons and other quantum particles, the wavefunction from the two possible paths can superpose. The probability of detection depends on the resulting $\lvert \psi \rvert^2$ pattern.

!!! warning "Common misconception"
    The interference pattern is not caused by electrons bumping into each other. It can build up even when particles are sent one at a time.

!!! question "Checkpoint"
    1. Why is electron diffraction evidence for wave behaviour?
    2. What is particle-like about single-particle double-slit experiments?
    3. What is wave-like about the final pattern?
