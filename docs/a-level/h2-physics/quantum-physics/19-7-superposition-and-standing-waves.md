# **19.7 Superposition and Standing Waves**

|       | Learning Outcome |
| ----- | ---------------- |
| 19(g) | explain that superposition applies to wavefunctions, leading to standing waves and single-particle interference |

## **Principle of Superposition**

When two or more wavefunctions overlap, the resultant wavefunction is the sum of the individual wavefunctions.

$$
\psi_{\text{resultant}} = \psi_1 + \psi_2
$$

Probability is then found from:

$$
\lvert \psi_{\text{resultant}} \rvert^2
$$

This matters because the probabilities are not found by simply adding $\lvert \psi_1 \rvert^2$ and $\lvert \psi_2 \rvert^2$ in general.

## **Constructive and Destructive Interference**

- If wavefunctions add in phase, the amplitude becomes larger: constructive interference.
- If wavefunctions add out of phase, the amplitude may cancel: destructive interference.

<div style="max-width:760px;margin:1rem 0;border:1px solid #dde3ea;border-radius:8px;overflow:hidden;background:#fff;">
<svg viewBox="0 0 760 360" role="img" aria-label="In-phase and antiphase wavefunction superposition" style="display:block;width:100%;height:auto;">
  <rect width="760" height="360" fill="#ffffff"/>
  <defs>
    <style>
      .super-title { font: 700 20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #111827; }
      .super-panel-title { font: 700 17px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #111827; }
      .super-label { font: 15px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #374151; }
      .super-small { font: 13px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6b7280; }
      .super-axis { stroke: #d1d5db; stroke-width: 2; }
      .super-divider { stroke: #e5e7eb; stroke-width: 2; }
    </style>
  </defs>

  <text x="28" y="38" class="super-title">Superposition: in phase and antiphase</text>
  <line x1="380" y1="62" x2="380" y2="332" class="super-divider"/>

  <text x="58" y="78" class="super-panel-title">In phase</text>
  <text x="438" y="78" class="super-panel-title">Antiphase</text>

  <line x1="62" y1="140" x2="345" y2="140" class="super-axis"/>
  <path d="M65 140 C88 95 112 95 135 140 C158 185 182 185 205 140 C228 95 252 95 275 140 C298 185 322 185 345 140" fill="none" stroke="#2563eb" stroke-width="5" stroke-linecap="round"/>
  <path d="M65 140 C88 95 112 95 135 140 C158 185 182 185 205 140 C228 95 252 95 275 140 C298 185 322 185 345 140" fill="none" stroke="#f59e0b" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="8 7"/>
  <text x="66" y="206" class="super-label">crest with crest, trough with trough</text>

  <line x1="62" y1="270" x2="345" y2="270" class="super-axis"/>
  <path d="M65 270 C88 190 112 190 135 270 C158 350 182 350 205 270 C228 190 252 190 275 270 C298 350 322 350 345 270" fill="none" stroke="#7c3aed" stroke-width="4" stroke-linecap="round"/>
  <text x="66" y="246" class="super-small">resultant</text>
  <text x="66" y="328" class="super-label">Constructive: larger amplitude</text>

  <line x1="432" y1="140" x2="715" y2="140" class="super-axis"/>
  <path d="M435 140 C458 95 482 95 505 140 C528 185 552 185 575 140 C598 95 622 95 645 140 C668 185 692 185 715 140" fill="none" stroke="#2563eb" stroke-width="5" stroke-linecap="round"/>
  <path d="M435 140 C458 185 482 185 505 140 C528 95 552 95 575 140 C598 185 622 185 645 140 C668 95 692 95 715 140" fill="none" stroke="#f59e0b" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="8 7"/>
  <text x="436" y="206" class="super-label">crest with trough, trough with crest</text>

  <line x1="432" y1="270" x2="715" y2="270" class="super-axis"/>
  <path d="M435 270 C458 266 482 266 505 270 C528 274 552 274 575 270 C598 266 622 266 645 270 C668 274 692 274 715 270" fill="none" stroke="#7c3aed" stroke-width="4" stroke-linecap="round"/>
  <text x="436" y="246" class="super-small">resultant</text>
  <text x="436" y="328" class="super-label">Destructive: cancellation is possible</text>
</svg>
</div>

## **Single-Particle Interference**

In a double-slit experiment, the wavefunction can have contributions from both slits.

$$
\psi = \psi_{\text{slit 1}} + \psi_{\text{slit 2}}
$$

The particle is detected at one point, but many detections build up the probability pattern given by $\lvert \psi \rvert^2$.

## **Standing Waves**

A standing wave can be formed by the superposition of two waves travelling in opposite directions.

In quantum physics, a confined particle can have standing wave solutions. Only certain standing waves fit the boundary conditions, so only certain wavelengths and energies are allowed.

!!! warning "Common misconception"
    A single particle does not split into two smaller classical pieces at the slits. The quantum state is described by a superposition of possible paths.

!!! question "Checkpoint"
    1. What mathematical operation combines overlapping wavefunctions?
    2. Why can destructive interference give a low probability of detection?
    3. How are standing waves related to superposition?
