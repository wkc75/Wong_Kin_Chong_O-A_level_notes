const octetExceptionContainer = document.getElementById("octet-exception-dot-cross-viewer");

if (octetExceptionContainer) {
    const molecules = {
        BeCl2: {
            label: "BeCl2",
            render: createBeCl2Svg,
        },
        BF3: {
            label: "BF3",
            render: createBf3Svg,
        },
        PCl5: {
            label: "PCl5",
            render: createPCl5Svg,
        },
        NO: {
            label: "NO",
            render: createNoSvg,
        },
        ClO2: {
            label: "ClO2",
            render: createClO2Svg,
        },
    };

    let selectedMolecule = "BeCl2";

    injectOctetExceptionDotCrossStyles();
    octetExceptionContainer.classList.add("octet-exception-dot-cross-component");
    octetExceptionContainer.innerHTML = `
        <div class="octet-exception-dot-cross-toolbar">
            ${Object.entries(molecules).map(([key, molecule], index) => `
                <button class="octet-exception-dot-cross-button ${index === 0 ? "is-active" : ""}" type="button" data-molecule="${key}" aria-pressed="${index === 0 ? "true" : "false"}">
                    ${molecule.label}
                </button>
            `).join("")}
        </div>
        <div class="octet-exception-dot-cross-stage"></div>
    `;

    const buttons = [...octetExceptionContainer.querySelectorAll("[data-molecule]")];
    const stage = octetExceptionContainer.querySelector(".octet-exception-dot-cross-stage");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedMolecule = button.dataset.molecule;
            render();
        });
    });

    function render() {
        stage.innerHTML = molecules[selectedMolecule].render();

        buttons.forEach((button) => {
            const isActive = button.dataset.molecule === selectedMolecule;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    render();
}

function createBeCl2Svg() {
    const leftCl = { x: 210, y: 138 };
    const be = { x: 380, y: 138 };
    const rightCl = { x: 550, y: 138 };

    return `
        <svg class="octet-exception-dot-cross-svg" viewBox="0 0 760 270" role="img" aria-label="Dot and cross diagram for BeCl2">
            <rect class="octet-exception-dot-cross-bg" x="0" y="0" width="760" height="270"></rect>
            ${atomLabel("Cl", leftCl.x, leftCl.y, 50)}
            ${atomLabel("Be", be.x, be.y, 50)}
            ${atomLabel("Cl", rightCl.x, rightCl.y, 50)}
            ${bondPair(leftCl.x + 56, leftCl.y - 6, "cross-dot")}
            ${bondPair(be.x + 56, be.y - 6, "dot-cross")}
            ${halogenLonePairs(leftCl.x, leftCl.y, "left")}
            ${halogenLonePairs(rightCl.x, rightCl.y, "right")}
        </svg>
    `;
}

function createBf3Svg() {
    const b = { x: 380, y: 150 };
    const topF = { x: 380, y: 58 };
    const leftF = { x: 260, y: 198 };
    const rightF = { x: 500, y: 198 };

    return `
        <svg class="octet-exception-dot-cross-svg" viewBox="0 0 760 310" role="img" aria-label="Dot and cross diagram for BF3">
            <rect class="octet-exception-dot-cross-bg" x="0" y="0" width="760" height="310"></rect>
            ${atomLabel("B", b.x, b.y, 52)}
            ${atomLabel("F", topF.x, topF.y, 52)}
            ${atomLabel("F", leftF.x, leftF.y, 52)}
            ${atomLabel("F", rightF.x, rightF.y, 52)}
            ${bondPair(b.x - 7, b.y - 52, "dot-cross")}
            ${bondPair(b.x - 64, b.y + 36, "dot-cross")}
            ${bondPair(b.x + 64, b.y + 36, "dot-cross")}
            ${fluorineLonePairs(topF.x, topF.y, "top")}
            ${fluorineLonePairs(leftF.x, leftF.y, "left")}
            ${fluorineLonePairs(rightF.x, rightF.y, "right")}
        </svg>
    `;
}

function createPCl5Svg() {
    const p = { x: 380, y: 210 };
    const topCl = { x: 380, y: 78 };
    const leftCl = { x: 205, y: 205 };
    const rightCl = { x: 555, y: 205 };
    const lowerLeftCl = { x: 285, y: 340 };
    const lowerRightCl = { x: 475, y: 340 };

    return `
        <svg class="octet-exception-dot-cross-svg" viewBox="0 0 760 440" role="img" aria-label="Dot and cross diagram for PCl5">
            <rect class="octet-exception-dot-cross-bg" x="0" y="0" width="760" height="440"></rect>
            ${atomLabel("Cl", topCl.x, topCl.y, 48)}
            ${atomLabel("Cl", leftCl.x, leftCl.y, 48)}
            ${atomLabel("P", p.x, p.y, 52)}
            ${atomLabel("Cl", rightCl.x, rightCl.y, 48)}
            ${atomLabel("Cl", lowerLeftCl.x, lowerLeftCl.y, 48)}
            ${atomLabel("Cl", lowerRightCl.x, lowerRightCl.y, 48)}
            ${electronCross(380, 132)}
            ${electronDot(380, 166)}
            ${electronCross(318, 202)}
            ${electronDot(346, 202)}
            ${electronDot(414, 202)}
            ${electronCross(442, 202)}
            ${electronDot(354, 258)}
            ${electronCross(332, 286)}
            ${electronDot(406, 258)}
            ${electronCross(428, 286)}
            ${pcl5ChlorineLonePairs(topCl.x, topCl.y, "top")}
            ${pcl5ChlorineLonePairs(leftCl.x, leftCl.y, "left")}
            ${pcl5ChlorineLonePairs(rightCl.x, rightCl.y, "right")}
            ${pcl5ChlorineLonePairs(lowerLeftCl.x, lowerLeftCl.y, "lower-left")}
            ${pcl5ChlorineLonePairs(lowerRightCl.x, lowerRightCl.y, "lower-right")}
        </svg>
    `;
}

function createNoSvg() {
    const n = { x: 318, y: 142 };
    const o = { x: 456, y: 142 };

    return `
        <svg class="octet-exception-dot-cross-svg" viewBox="0 0 760 260" role="img" aria-label="Dot and cross diagram for NO">
            <rect class="octet-exception-dot-cross-bg" x="0" y="0" width="760" height="260"></rect>
            ${atomLabel("N", n.x, n.y, 52)}
            ${atomLabel("O", o.x, o.y, 52)}
            ${electronCross(376, 126)}
            ${electronDot(394, 126)}
            ${electronCross(376, 158)}
            ${electronDot(394, 158)}
            ${electronCross(n.x - 58, n.y - 16)}
            ${electronCross(n.x - 58, n.y + 16)}
            ${electronCross(n.x, n.y - 58)}
            ${electronDot(o.x - 12, o.y - 54)}
            ${electronDot(o.x + 18, o.y - 54)}
            ${electronDot(o.x + 58, o.y - 14)}
            ${electronDot(o.x + 58, o.y + 18)}
        </svg>
    `;
}

function createClO2Svg() {
    const topO = { x: 398, y: 76 };
    const leftO = { x: 262, y: 202 };
    const cl = { x: 418, y: 202 };

    return `
        <svg class="octet-exception-dot-cross-svg" viewBox="0 0 760 330" role="img" aria-label="Dot and cross diagram for ClO2">
            <rect class="octet-exception-dot-cross-bg" x="0" y="0" width="760" height="330"></rect>
            ${atomLabel("O", topO.x, topO.y, 52)}
            ${atomLabel("O", leftO.x, leftO.y, 52)}
            ${atomLabel("Cl", cl.x, cl.y, 52)}
            ${electronCross(382, 133)}
            ${electronCross(412, 133)}
            ${electronDot(388, 165)}
            ${electronDot(418, 165)}
            ${electronCross(326, 184)}
            ${electronCross(326, 214)}
            ${electronDot(356, 184)}
            ${electronDot(356, 214)}
            ${electronDot(cl.x + 70, cl.y - 22)}
            ${electronDot(cl.x + 70, cl.y + 16)}
            ${electronDot(cl.x + 18, cl.y + 60)}
            ${chlorineDioxideOxygenLonePairs(topO.x, topO.y, "top")}
            ${chlorineDioxideOxygenLonePairs(leftO.x, leftO.y, "left")}
        </svg>
    `;
}

function atomLabel(symbol, x, y, size) {
    return `<text class="octet-exception-symbol" x="${x}" y="${y}" font-size="${size}">${symbol}</text>`;
}

function bondPair(x, y, order) {
    const first = order === "dot-cross" ? electronDot(x - 8, y) : electronCross(x - 8, y);
    const second = order === "dot-cross" ? electronCross(x + 8, y) : electronDot(x + 8, y);

    return `${first}${second}`;
}

function halogenLonePairs(x, y, side) {
    const direction = side === "left" ? -1 : 1;

    return `
        ${electronCross(x - 18, y - 57)}
        ${electronCross(x + 18, y - 57)}
        ${electronCross(x - 18, y + 33)}
        ${electronCross(x + 18, y + 33)}
        ${electronCross(x + direction * 58, y - 16)}
        ${electronCross(x + direction * 58, y + 16)}
    `;
}

function fluorineLonePairs(x, y, position) {
    if (position === "top") {
        return `
            ${electronCross(x - 18, y - 50)}
            ${electronCross(x + 18, y - 50)}
            ${electronCross(x - 48, y - 6)}
            ${electronCross(x - 48, y + 24)}
            ${electronCross(x + 48, y - 6)}
            ${electronCross(x + 48, y + 24)}
        `;
    }

    const direction = position === "left" ? -1 : 1;

    return `
        ${electronCross(x - 16, y - 48)}
        ${electronCross(x + 16, y - 48)}
        ${electronCross(x - 16, y + 36)}
        ${electronCross(x + 16, y + 36)}
        ${electronCross(x + direction * 48, y - 6)}
        ${electronCross(x + direction * 48, y + 24)}
    `;
}

function pcl5ChlorineLonePairs(x, y, position) {
    if (position === "top") {
        return `
            ${electronCross(x - 18, y - 50)}
            ${electronCross(x + 18, y - 50)}
            ${electronCross(x - 48, y - 6)}
            ${electronCross(x - 48, y + 24)}
            ${electronCross(x + 48, y - 6)}
            ${electronCross(x + 48, y + 24)}
        `;
    }

    if (position === "left" || position === "right") {
        return halogenLonePairs(x, y, position);
    }

    if (position === "lower-left") {
        return `
            ${electronCross(x - 22, y - 54)}
            ${electronCross(x + 12, y - 54)}
            ${electronCross(x - 55, y - 8)}
            ${electronCross(x - 55, y + 22)}
            ${electronCross(x - 18, y + 48)}
            ${electronCross(x + 18, y + 48)}
        `;
    }

    return `
        ${electronCross(x - 12, y - 54)}
        ${electronCross(x + 22, y - 54)}
        ${electronCross(x + 55, y - 8)}
        ${electronCross(x + 55, y + 22)}
        ${electronCross(x - 18, y + 48)}
        ${electronCross(x + 18, y + 48)}
    `;
}

function chlorineDioxideOxygenLonePairs(x, y, position) {
    if (position === "top") {
        return `
            ${electronCross(x - 18, y - 50)}
            ${electronCross(x + 18, y - 50)}
            ${electronCross(x - 50, y - 8)}
            ${electronCross(x - 44, y + 22)}
        `;
    }

    return `
        ${electronCross(x - 54, y - 22)}
        ${electronCross(x - 54, y + 12)}
        ${electronCross(x - 18, y - 54)}
        ${electronCross(x + 20, y - 50)}
    `;
}

function electronDot(x, y) {
    return `<circle class="octet-exception-dot" cx="${x}" cy="${y}" r="4"></circle>`;
}

function electronCross(x, y) {
    return `<text class="octet-exception-cross" x="${x}" y="${y}">x</text>`;
}

function injectOctetExceptionDotCrossStyles() {
    if (document.getElementById("octet-exception-dot-cross-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "octet-exception-dot-cross-styles";
    style.textContent = `
        .octet-exception-dot-cross-component {
            width: 100%;
            max-width: 920px;
            margin: 1.25rem 0;
        }

        .octet-exception-dot-cross-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
            margin-bottom: 0.75rem;
        }

        .octet-exception-dot-cross-button {
            border: 1px solid #c8d2df;
            border-radius: 8px;
            background: #ffffff;
            color: #111827;
            cursor: pointer;
            font: 700 0.95rem Roboto, Arial, sans-serif;
            min-width: 5.5rem;
            padding: 0.45rem 0.75rem;
        }

        .octet-exception-dot-cross-button:hover,
        .octet-exception-dot-cross-button.is-active {
            border-color: #2563eb;
            background: #eaf2ff;
            color: #1e3a8a;
        }

        .octet-exception-dot-cross-stage {
            background: #ffffff;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            overflow: hidden;
        }

        .octet-exception-dot-cross-svg {
            display: block;
            width: 100%;
            height: auto;
            background: #ffffff;
        }

        .octet-exception-dot-cross-bg {
            fill: #ffffff;
        }

        .octet-exception-symbol,
        .octet-exception-cross {
            fill: #111827;
            font-family: Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .octet-exception-symbol {
            font-weight: 500;
            dominant-baseline: central;
        }

        .octet-exception-cross {
            font-size: 22px;
            font-weight: 800;
            dominant-baseline: middle;
        }

        .octet-exception-dot {
            fill: #111827;
        }
    `;

    document.head.appendChild(style);
}
