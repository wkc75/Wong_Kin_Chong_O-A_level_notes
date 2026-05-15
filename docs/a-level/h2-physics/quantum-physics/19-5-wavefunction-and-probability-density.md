# **19.5 Wavefunction and Probability Density**

|       | Learning Outcome |
| ----- | ---------------- |
| 19(f) | explain that a particle's state can be represented by a wavefunction $\psi$, and that $\lvert \psi \rvert^2$ is the probability density |

## **Wavefunction**

<!--prettier-ignore-->
!!! definition "Definition"
    The **wavefunction** $\psi$ is a mathematical description of a particle's quantum state.

The wavefunction itself is not directly observed. What is physically useful is the probability density:

$$
\lvert \psi \rvert^2
$$

<!--prettier-ignore-->
!!! definition "Definition"
    $\lvert \psi \rvert^2$ is the **probability density**, which tells us where the particle is more likely to be detected.

## **Probability and Area**

In one dimension, the probability of detecting the particle between $x=a$ and $x=b$ is the area under the $\lvert \psi \rvert^2$ graph over that interval.

$$
P(a \le x \le b) = \int_a^b \lvert \psi \rvert^2 dx
$$

For a correctly normalised wavefunction:

$$
\int_{\text{all space}} \lvert \psi \rvert^2 dx = 1
$$

The total probability of finding the particle somewhere is 1.

<div style="max-width:760px;margin:1rem 0;border:1px solid #dde3ea;border-radius:8px;overflow:hidden;background:#fff;">
<svg viewBox="0 0 760 320" role="img" aria-label="Wavefunction and probability density" style="display:block;width:100%;height:auto;">
  <rect width="760" height="320" fill="#ffffff"/>
  <defs>
    <marker id="wavefunction-axis-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#111827"/>
    </marker>
  </defs>

  <text x="28" y="38" font-size="20" font-weight="700" fill="#111827">From wavefunction to probability density</text>
  <text x="96" y="72" font-size="16" font-weight="700" fill="#2563eb">ψ can be positive or negative</text>
  <text x="444" y="72" font-size="16" font-weight="700" fill="#1d4ed8">|ψ|² is never negative</text>

  <line x1="80" y1="190" x2="340" y2="190" stroke="#111827" stroke-width="2" marker-end="url(#wavefunction-axis-arrow)"/>
  <line x1="95" y1="280" x2="95" y2="95" stroke="#111827" stroke-width="2" marker-end="url(#wavefunction-axis-arrow)"/>
  <line x1="95" y1="130" x2="340" y2="130" stroke="#e5e7eb" stroke-width="1.4" stroke-dasharray="5 6"/>
  <line x1="95" y1="250" x2="340" y2="250" stroke="#e5e7eb" stroke-width="1.4" stroke-dasharray="5 6"/>
  <path d="M100 190 C122 112 160 112 182 190 C204 268 242 268 264 190 C286 112 324 112 346 190" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>
  <text x="78" y="116" font-size="16" font-weight="700" fill="#374151">ψ</text>
  <text x="348" y="209" font-size="16" fill="#374151">x</text>
  <text x="198" y="300" font-size="14" fill="#6b7280">wavefunction</text>

  <line x1="430" y1="275" x2="700" y2="275" stroke="#111827" stroke-width="2" marker-end="url(#wavefunction-axis-arrow)"/>
  <line x1="445" y1="275" x2="445" y2="95" stroke="#111827" stroke-width="2" marker-end="url(#wavefunction-axis-arrow)"/>
  <path d="M450 275 C472 128 510 128 532 275 C554 128 592 128 614 275 C636 128 674 128 696 275 L696 275 L450 275 Z" fill="#dbeafe" opacity="0.9"/>
  <path d="M450 275 C472 128 510 128 532 275 C554 128 592 128 614 275 C636 128 674 128 696 275" fill="none" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round"/>
  <text x="418" y="116" font-size="16" font-weight="700" fill="#374151">|ψ|²</text>
  <text x="708" y="294" font-size="16" fill="#374151">x</text>
  <text x="535" y="300" font-size="14" fill="#6b7280">probability density</text>
</svg>
</div>

## **Exam Language**

Use these phrases:

- $\psi$ represents the quantum state of the particle.
- $\lvert \psi \rvert^2$ gives probability density.
- A larger $\lvert \psi \rvert^2$ means a greater probability of detecting the particle in that region.
- Probability is found from the area under the $\lvert \psi \rvert^2$ graph.

Avoid these phrases:

- "$\psi$ is the probability."
- "The electron is literally spread out as a cloud of matter."
- "A negative $\psi$ means negative probability."

!!! warning "Common misconception"
    $\psi$ may be positive, negative or complex. Probability density $\lvert \psi \rvert^2$ cannot be negative.

!!! question "Checkpoint"
    1. Which quantity gives probability density: $\psi$ or $\lvert \psi \rvert^2$?
    2. What does the area under a $\lvert \psi \rvert^2$ graph represent?
    3. Why must the total area under $\lvert \psi \rvert^2$ be 1?
