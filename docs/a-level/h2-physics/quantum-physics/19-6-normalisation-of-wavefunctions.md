# **19.6 Normalisation of Wavefunctions**

|       | Learning Outcome |
| ----- | ---------------- |
| 19(f) | calculate normalisation factors for square and sinusoidal wavefunctions |

## **Why Normalise?**

The total probability of finding the particle somewhere must be 1.

For a one-dimensional wavefunction:

$$
\int \lvert \psi \rvert^2 dx = 1
$$

Normalisation means choosing the constant in $\psi$ so that this condition is satisfied.

## **Square Wavefunction**

Suppose:

$$
\psi(x) = A
$$

for $0 \le x \le L$, and $\psi(x)=0$ elsewhere.

Normalise:

$$
\int_0^L \lvert A \rvert^2 dx = 1
$$

$$
A^2L = 1
$$

$$
A = \frac{1}{\sqrt{L}}
$$

The sign of $A$ is not usually important for probability, because $\lvert \psi \rvert^2$ is used.

<div style="max-width:720px;margin:1rem 0;border:1px solid #dde3ea;border-radius:8px;overflow:hidden;background:#fff;">
<svg viewBox="0 0 720 330" role="img" aria-label="Normalising a square wavefunction by making the area under probability density equal to one" style="display:block;width:100%;height:auto;">
  <rect width="720" height="330" fill="#ffffff"/>
  <defs>
    <marker id="normalisation-axis-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#111827"/>
    </marker>
    <pattern id="normalisation-area-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="10" height="10" fill="#dbeafe"/>
      <line x1="0" y1="0" x2="0" y2="10" stroke="#bfdbfe" stroke-width="3"/>
    </pattern>
    <style>
      .norm-title { font: 700 20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #111827; }
      .norm-label { font: 15px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #374151; }
      .norm-small { font: 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #374151; }
      .norm-eq { font: 700 18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #1d4ed8; }
    </style>
  </defs>

  <text x="28" y="38" class="norm-title">Square probability density</text>
  <text x="28" y="62" class="norm-small">Normalisation means the shaded area under |ψ|² is 1.</text>

  <line x1="92" y1="250" x2="650" y2="250" stroke="#111827" stroke-width="2.2" marker-end="url(#normalisation-axis-arrow)"/>
  <line x1="120" y1="250" x2="120" y2="74" stroke="#111827" stroke-width="2.2" marker-end="url(#normalisation-axis-arrow)"/>

  <rect x="165" y="105" width="330" height="145" fill="url(#normalisation-area-hatch)" stroke="#2563eb" stroke-width="4"/>

  <line x1="120" y1="105" x2="165" y2="105" stroke="#64748b" stroke-width="1.6" stroke-dasharray="5 5"/>
  <text x="82" y="110" class="norm-label">A²</text>

  <line x1="165" y1="268" x2="495" y2="268" stroke="#374151" stroke-width="1.8"/>
  <line x1="165" y1="260" x2="165" y2="276" stroke="#374151" stroke-width="1.8"/>
  <line x1="495" y1="260" x2="495" y2="276" stroke="#374151" stroke-width="1.8"/>
  <text x="324" y="294" font-size="16" font-weight="700" fill="#374151">L</text>

  <text x="159" y="247" class="norm-label">0</text>
  <text x="489" y="247" class="norm-label">L</text>
  <text x="656" y="255" class="norm-label">x</text>
  <text x="54" y="82" class="norm-label">|ψ|²</text>

  <text x="276" y="162" class="norm-eq">area = A²L</text>
  <text x="289" y="194" class="norm-eq">A²L = 1</text>
  <text x="285" y="226" class="norm-eq">A = 1/√L</text>

  <rect x="520" y="105" width="150" height="90" rx="6" fill="#f8fafc" stroke="#e5e7eb"/>
  <text x="535" y="132" class="norm-small">ψ = A</text>
  <text x="535" y="157" class="norm-small">0 ≤ x ≤ L</text>
  <text x="535" y="182" class="norm-small">|ψ|² = A²</text>
</svg>
</div>

## **Sinusoidal Wavefunction**

For a particle in a box, a common wavefunction is:

$$
\psi(x)=A\sin\left(\frac{n\pi x}{L}\right)
$$

for $0 \le x \le L$.

Normalise:

$$
\int_0^L A^2\sin^2\left(\frac{n\pi x}{L}\right) dx = 1
$$

Use:

$$
\int_0^L \sin^2\left(\frac{n\pi x}{L}\right) dx = \frac{L}{2}
$$

So:

$$
A^2\frac{L}{2} = 1
$$

$$
A = \sqrt{\frac{2}{L}}
$$

Therefore:

$$
\psi_n(x)=\sqrt{\frac{2}{L}}\sin\left(\frac{n\pi x}{L}\right)
$$

## **Worked Example**

A particle has $\psi(x)=A$ from $x=0$ to $x=0.50\ \text{m}$ and zero elsewhere. Find $A$.

$$
A = \frac{1}{\sqrt{L}} = \frac{1}{\sqrt{0.50}}
$$

$$
A = 1.4\ \text{m}^{-1/2}
$$

The unit appears because $\lvert \psi \rvert^2 dx$ must be dimensionless.

!!! warning "Common misconception"
    Do not normalise $\psi$ by making $\int \psi dx = 1$. Probability uses $\int \lvert \psi \rvert^2 dx$.

!!! question "Checkpoint"
    1. Why must the total probability be 1?
    2. What is the normalisation constant for $\psi=A$ over $0 \le x \le L$?
    3. What is the normalisation constant for $A\sin\left(\frac{n\pi x}{L}\right)$ over $0 \le x \le L$?
