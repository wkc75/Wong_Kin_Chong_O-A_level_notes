# **19.8 Particle in a Box**

|       | Learning Outcomes |
| ----- | ----------------- |
| 19(i) | understand standing wave solutions $\psi_n$ for a particle in a one-dimensional infinite square well |
| 19(j) | solve problems using $E_n = \frac{h^2n^2}{8mL^2}$ |

## **Infinite Square Well**

A one-dimensional infinite square well is a model where a particle is confined between two impenetrable walls at $x=0$ and $x=L$.

The wavefunction must be zero at the walls:

$$
\psi(0)=0
$$

$$
\psi(L)=0
$$

Only standing waves that fit these boundary conditions are allowed.

## **Allowed Wavefunctions**

The allowed wavefunctions are:

$$
\psi_n(x)=A\sin\left(\frac{n\pi x}{L}\right)
$$

where:

- $n = 1, 2, 3, ...$
- $A = \sqrt{\frac{2}{L}}$ for normalisation
- $n$ is the quantum number

## **Allowed Wavelengths**

For a standing wave in the box:

$$
L = \frac{n\lambda}{2}
$$

So:

$$
\lambda = \frac{2L}{n}
$$

<div style="max-width:760px;margin:1rem 0;border:1px solid #dde3ea;border-radius:8px;overflow:hidden;background:#fff;">
<svg viewBox="0 0 760 470" role="img" aria-label="Particle in a box standing waves and energy levels" style="display:block;width:100%;height:auto;">
  <rect width="760" height="470" fill="#ffffff"/>
  <defs>
    <style>
      .box-title { font: 700 20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #111827; }
      .box-section-title { font: 700 16px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #111827; }
      .box-label { font: 16px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #374151; }
      .box-small { font: 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6b7280; }
      .box-wall { stroke: #111827; stroke-width: 4.5; stroke-linecap: round; }
      .box-guide { stroke: #d1d5db; stroke-width: 2; }
      .box-separator { stroke: #eef2f7; stroke-width: 1.5; }
      .box-wave { fill: none; stroke: #2563eb; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
      .box-node { fill: #ffffff; stroke: #2563eb; stroke-width: 2; }
      .energy-line { stroke: #f59e0b; stroke-width: 4; stroke-linecap: round; }
    </style>
  </defs>

  <text x="28" y="38" class="box-title">Allowed standing waves in a box</text>

  <rect x="64" y="72" width="392" height="96" rx="4" fill="#f8fafc"/>
  <rect x="64" y="182" width="392" height="96" rx="4" fill="#ffffff"/>
  <rect x="64" y="292" width="392" height="96" rx="4" fill="#f8fafc"/>
  <line x1="64" y1="176" x2="456" y2="176" class="box-separator"/>
  <line x1="64" y1="286" x2="456" y2="286" class="box-separator"/>

  <g>
    <line x1="80" y1="76" x2="80" y2="386" class="box-wall"/>
    <line x1="440" y1="76" x2="440" y2="386" class="box-wall"/>
  </g>

  <line x1="80" y1="125" x2="440" y2="125" class="box-guide"/>
  <line x1="80" y1="235" x2="440" y2="235" class="box-guide"/>
  <line x1="80" y1="345" x2="440" y2="345" class="box-guide"/>

  <path d="M80 125 C170 82 350 82 440 125" class="box-wave"/>
  <path d="M80 235 C125 196 215 196 260 235 C305 274 395 274 440 235" class="box-wave"/>
  <path d="M80 345 C110 312 170 312 200 345 C230 378 290 378 320 345 C350 312 410 312 440 345" class="box-wave"/>

  <g>
    <circle cx="80" cy="125" r="4" class="box-node"/>
    <circle cx="440" cy="125" r="4" class="box-node"/>
    <circle cx="80" cy="235" r="4" class="box-node"/>
    <circle cx="260" cy="235" r="4" class="box-node"/>
    <circle cx="440" cy="235" r="4" class="box-node"/>
    <circle cx="80" cy="345" r="4" class="box-node"/>
    <circle cx="200" cy="345" r="4" class="box-node"/>
    <circle cx="320" cy="345" r="4" class="box-node"/>
    <circle cx="440" cy="345" r="4" class="box-node"/>
  </g>

  <text x="462" y="130" class="box-label">n = 1</text>
  <text x="462" y="240" class="box-label">n = 2</text>
  <text x="462" y="350" class="box-label">n = 3</text>

  <line x1="80" y1="418" x2="440" y2="418" stroke="#374151" stroke-width="1.8"/>
  <line x1="80" y1="410" x2="80" y2="426" stroke="#374151" stroke-width="1.8"/>
  <line x1="440" y1="410" x2="440" y2="426" stroke="#374151" stroke-width="1.8"/>
  <text x="238" y="444" class="box-label">width L</text>

  <g>
    <text x="552" y="70" class="box-section-title">Energy levels</text>
    <line x1="585" y1="390" x2="585" y2="95" stroke="#111827" stroke-width="2"/>
    <line x1="545" y1="390" x2="705" y2="390" stroke="#111827" stroke-width="2"/>
    <line x1="555" y1="335" x2="685" y2="335" class="energy-line"/>
    <line x1="555" y1="245" x2="685" y2="245" class="energy-line"/>
    <line x1="555" y1="120" x2="685" y2="120" class="energy-line"/>
    <text x="692" y="341" class="box-label">E1</text>
    <text x="692" y="251" class="box-label">E2</text>
    <text x="692" y="126" class="box-label">E3</text>
    <text x="552" y="416" class="box-small">E3 - E2 &gt; E2 - E1</text>
  </g>
</svg>
</div>

## **Allowed Energies**

Using de Broglie relation and kinetic energy:

$$
E_n = \frac{h^2n^2}{8mL^2}
$$

Important features:

- Energy is quantised.
- $E_n$ is proportional to $n^2$.
- Higher $n$ means a shorter wavelength and higher energy.
- The lowest possible energy is $E_1$, not zero.

!!! warning "Common misconception"
    $n=0$ is not allowed. It would give $\psi=0$ everywhere, meaning no particle in the box.

## **Worked Example**

An electron is trapped in a one-dimensional box of width $1.0\ \text{nm}$. Find the ground state energy.

$$
E_1 = \frac{h^2}{8mL^2}
$$

$$
E_1 = \frac{(6.63 \times 10^{-34})^2}{8(9.11 \times 10^{-31})(1.0 \times 10^{-9})^2}
$$

$$
E_1 = 6.0 \times 10^{-20}\ \text{J}
$$

In eV:

$$
E_1 = \frac{6.0 \times 10^{-20}}{1.60 \times 10^{-19}} = 0.38\ \text{eV}
$$

## **Exam Use**

- Check that $L$ is in metres.
- Use the particle mass $m$, not photon momentum.
- Remember that $E_2 = 4E_1$ and $E_3 = 9E_1$ for the same box.

!!! question "Checkpoint"
    1. Why must $\psi$ be zero at the walls?
    2. Why is energy quantised in the box?
    3. If $E_1 = 2.0 \times 10^{-19}\ \text{J}$, what is $E_3$?
