# **19.9 Heisenberg Uncertainty Principle**

|       | Learning Outcome |
| ----- | ---------------- |
| 19(h) | understand that $\Delta x \Delta p \gtrsim h$ relates to the need for a spread of momenta for localised particles, and apply this to solve problems |

## **Position-Momentum Uncertainty**

The more localised a particle is in position, the larger the required spread of momenta.

$$
\Delta x \Delta p \gtrsim h
$$

where:

- $\Delta x$ is the uncertainty in position
- $\Delta p$ is the uncertainty in momentum
- $h$ is the Planck constant

This is not due to poor apparatus. It is a property of quantum states.

## **Why Localisation Requires Momentum Spread**

A very localised wave packet is made by superposing many waves with different wavelengths. Since momentum is related to wavelength,

$$
p = \frac{h}{\lambda}
$$

a spread of wavelengths means a spread of momenta.

<div style="max-width:760px;margin:1rem 0;border:1px solid #dde3ea;border-radius:8px;overflow:hidden;background:#fff;">
<svg viewBox="0 0 760 300" role="img" aria-label="Localised wave packet requires many wavelengths" style="display:block;width:100%;height:auto;">
  <rect width="760" height="300" fill="#ffffff"/>
  <text x="28" y="38" font-size="20" font-weight="700" fill="#111827">Localised position means spread of momentum</text>
  <line x1="70" y1="125" x2="690" y2="125" stroke="#d1d5db" stroke-width="2"/>
  <path d="M75 125 C110 75 145 75 180 125 C215 175 250 175 285 125 C320 75 355 75 390 125 C425 175 460 175 495 125 C530 75 565 75 600 125 C635 175 665 175 690 125" fill="none" stroke="#9ca3af" stroke-width="3"/>
  <text x="78" y="188" font-size="16" fill="#374151">one wavelength: fairly definite momentum, spread out position</text>
  <line x1="70" y1="245" x2="690" y2="245" stroke="#d1d5db" stroke-width="2"/>
  <path d="M210 245 C230 230 250 220 270 245 C290 285 315 285 335 245 C355 205 380 205 400 245 C420 285 445 285 465 245 C485 220 505 230 525 245" fill="none" stroke="#2563eb" stroke-width="4"/>
  <text x="210" y="282" font-size="16" fill="#374151">wave packet: localised position, many momenta</text>
</svg>
</div>

## **Worked Example**

An electron is localised within a region of width $1.0 \times 10^{-10}\ \text{m}$. Estimate the minimum uncertainty in its momentum.

$$
\Delta x \Delta p \gtrsim h
$$

$$
\Delta p \gtrsim \frac{h}{\Delta x}
$$

$$
\Delta p \gtrsim \frac{6.63 \times 10^{-34}}{1.0 \times 10^{-10}}
$$

$$
\Delta p \gtrsim 6.6 \times 10^{-24}\ \text{kg m s}^{-1}
$$

The corresponding uncertainty in speed is:

$$
\Delta v \gtrsim \frac{\Delta p}{m}
$$

$$
\Delta v \gtrsim \frac{6.6 \times 10^{-24}}{9.11 \times 10^{-31}}
$$

$$
\Delta v \gtrsim 7.3 \times 10^6\ \text{m s}^{-1}
$$

## **Exam Use**

- Treat $\Delta x \Delta p \gtrsim h$ as an order-of-magnitude estimate.
- A smaller $\Delta x$ gives a larger minimum $\Delta p$.
- Link the idea to wave packets and spread of wavelengths.

!!! warning "Common misconception"
    The uncertainty principle is not just measurement disturbance. Even before measurement, a highly localised quantum state needs a spread of momenta.

!!! question "Checkpoint"
    1. What happens to $\Delta p$ if $\Delta x$ is made smaller?
    2. Why does a wave packet require a range of wavelengths?
    3. Estimate $\Delta p$ for $\Delta x = 2.0 \times 10^{-9}\ \text{m}$.

