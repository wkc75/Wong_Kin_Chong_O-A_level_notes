const effectsHydrogenBondingComponents = [
    ["effects-hbond-boiling-graph", initEffectsHbondBoilingGraph],
    ["effects-hbond-nitrophenol", initEffectsHbondNitrophenol],
    ["effects-hbond-carboxylic-dimer", initEffectsHbondCarboxylicDimer],
    ["effects-hbond-ice-water", initEffectsHbondIceWater],
    ["effects-hbond-surface-tension", initEffectsHbondSurfaceTension],
];

const effectsHbondBoilingPoints = [
    { formula: "H2O", label: "H2O", value: 100, hydrogenBonding: true, group: "Group 16" },
    { formula: "H2S", label: "H2S", value: -60, hydrogenBonding: false, group: "Group 16" },
    { formula: "H2Se", label: "H2Se", value: -41, hydrogenBonding: false, group: "Group 16" },
    { formula: "H2Te", label: "H2Te", value: -2, hydrogenBonding: false, group: "Group 16" },
    { formula: "NH3", label: "NH3", value: -33, hydrogenBonding: true, group: "Hydrogen bonding" },
    { formula: "HF", label: "HF", value: 20, hydrogenBonding: true, group: "Hydrogen bonding" },
];

function initEffectsOfHydrogenBonding() {
    injectEffectsHbondStyles();

    effectsHydrogenBondingComponents.forEach(([id, init]) => {
        const container = document.getElementById(id);

        if (container) {
            init(container);
        }
    });
}

function initEffectsHbondBoilingGraph(container) {
    if (container.dataset.effectsHbondReady === "true") {
        return;
    }

    container.dataset.effectsHbondReady = "true";
    container.classList.add("effects-hbond-component");
    container.innerHTML = `
        <div class="effects-hbond-stage">
            ${createEffectsHbondBoilingSvg()}
        </div>
    `;
}

function createEffectsHbondBoilingSvg() {
    const chart = {
        left: 88,
        top: 54,
        width: 744,
        height: 348,
        min: -110,
        max: 110,
    };
    const baselineY = mapBoilingPoint(0, chart);
    const barWidth = 64;
    const step = chart.width / effectsHbondBoilingPoints.length;
    const group16Trend = effectsHbondBoilingPoints
        .filter((point) => point.group === "Group 16" && point.formula !== "H2O")
        .map((point) => {
            const index = effectsHbondBoilingPoints.indexOf(point);
            const x = chart.left + step * index + step / 2;
            const y = mapBoilingPoint(point.value, chart);

            return `${x},${y}`;
        })
        .join(" ");

    return `
        <svg class="effects-hbond-svg effects-hbond-boiling-svg" viewBox="0 0 900 500" role="img" aria-labelledby="effects-hbond-boiling-title effects-hbond-boiling-desc">
            <title id="effects-hbond-boiling-title">Boiling point comparison for simple hydrides</title>
            <desc id="effects-hbond-boiling-desc">
                A bar chart comparing approximate normal boiling points. H2O, NH3 and HF are highlighted because they can form hydrogen bonds.
            </desc>
            <rect class="effects-hbond-bg" x="0" y="0" width="900" height="500"></rect>
            <text class="effects-hbond-title" x="450" y="31">Approximate normal boiling points</text>
            <text class="effects-hbond-axis-label" x="32" y="228" transform="rotate(-90 32 228)">Boiling point / deg C</text>
            ${createBoilingGrid(chart, [-100, -50, 0, 50, 100])}
            <line class="effects-hbond-axis" x1="${chart.left}" y1="${chart.top}" x2="${chart.left}" y2="${chart.top + chart.height}"></line>
            <line class="effects-hbond-axis" x1="${chart.left}" y1="${baselineY}" x2="${chart.left + chart.width}" y2="${baselineY}"></line>
            <polyline class="effects-hbond-trend-line" points="${group16Trend}"></polyline>
            <text class="effects-hbond-small-note" x="440" y="371">Group 16 hydrides without hydrogen bonding</text>
            ${effectsHbondBoilingPoints.map((point, index) => createBoilingBar(point, index, chart, barWidth, step, baselineY)).join("")}
            <g class="effects-hbond-legend" aria-hidden="true">
                <rect class="effects-hbond-legend-swatch effects-hbond-legend-swatch--highlight" x="594" y="430" width="18" height="18" rx="4"></rect>
                <text x="620" y="444">Hydrogen bonding</text>
                <rect class="effects-hbond-legend-swatch effects-hbond-legend-swatch--ordinary" x="594" y="459" width="18" height="18" rx="4"></rect>
                <text x="620" y="473">No hydrogen bonding</text>
            </g>
        </svg>
    `;
}

function createBoilingGrid(chart, ticks) {
    return ticks.map((tick) => {
        const y = mapBoilingPoint(tick, chart);
        const gridClass = tick === 0 ? " effects-hbond-grid--zero" : "";

        return `
            <g class="effects-hbond-grid${gridClass}">
                <line x1="${chart.left}" y1="${y}" x2="${chart.left + chart.width}" y2="${y}"></line>
                <text x="${chart.left - 13}" y="${y + 5}">${tick}</text>
            </g>
        `;
    }).join("");
}

function createBoilingBar(point, index, chart, barWidth, step, baselineY) {
    const x = chart.left + step * index + step / 2 - barWidth / 2;
    const valueY = mapBoilingPoint(point.value, chart);
    const y = Math.min(valueY, baselineY);
    const height = Math.abs(baselineY - valueY);
    const valueLabelY = point.value >= 0 ? y - 12 : y + height + 22;
    const highlightClass = point.hydrogenBonding ? " effects-hbond-bar--highlight" : "";
    const tagY = point.value > 60 ? valueY + 24 : valueY - 30;
    const tag = point.hydrogenBonding
        ? `<text class="effects-hbond-bar-tag" x="${x + barWidth / 2}" y="${tagY}">H bonding</text>`
        : "";

    return `
        <g class="effects-hbond-bar-group">
            <rect class="effects-hbond-bar${highlightClass}" x="${x}" y="${y}" width="${barWidth}" height="${height}" rx="6"></rect>
            <text class="effects-hbond-value" x="${x + barWidth / 2}" y="${valueLabelY}">${point.value}</text>
            <text class="effects-hbond-x-label" x="${x + barWidth / 2}" y="424">${point.label}</text>
            ${tag}
        </g>
    `;
}

function mapBoilingPoint(value, chart) {
    return chart.top + ((chart.max - value) / (chart.max - chart.min)) * chart.height;
}

function initEffectsHbondNitrophenol(container) {
    if (container.dataset.effectsHbondReady === "true") {
        return;
    }

    container.dataset.effectsHbondReady = "true";
    container.classList.add("effects-hbond-component");
    container.innerHTML = `
        <div class="effects-hbond-stage">
            ${createNitrophenolSvg()}
        </div>
    `;
}

function createNitrophenolSvg() {
    return `
        <svg class="effects-hbond-svg effects-hbond-nitrophenol-svg" viewBox="0 0 900 470" role="img" aria-labelledby="effects-hbond-nitro-title effects-hbond-nitro-desc">
            <title id="effects-hbond-nitro-title">Intramolecular and intermolecular hydrogen bonding in nitrophenols</title>
            <desc id="effects-hbond-nitro-desc">
                2-nitrophenol forms an intramolecular hydrogen bond between the phenolic hydrogen atom and a nitro oxygen atom. 4-nitrophenol forms intermolecular hydrogen bonds between neighbouring molecules.
            </desc>
            <rect class="effects-hbond-bg" x="0" y="0" width="900" height="470"></rect>
            <line class="effects-hbond-divider" x1="450" y1="48" x2="450" y2="424"></line>
            <text class="effects-hbond-title" x="225" y="36">2-nitrophenol</text>
            <text class="effects-hbond-title" x="675" y="36">4-nitrophenol</text>
            ${createOrthoNitrophenol()}
            ${createParaNitrophenolPair()}
        </svg>
    `;
}

function createOrthoNitrophenol() {
    return `
        <g class="effects-hbond-molecule">
            ${createBenzeneRing(225, 250, 68)}
            <line class="effects-hbond-bond" x1="225" y1="182" x2="225" y2="130"></line>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="225" y="114">O</text>
            <line class="effects-hbond-bond" x1="244" y1="111" x2="282" y2="119"></line>
            <text class="effects-hbond-atom" x="303" y="125">H</text>
            <line class="effects-hbond-bond" x1="284" y1="216" x2="334" y2="190"></line>
            <text class="effects-hbond-atom" x="357" y="181">N</text>
            <line class="effects-hbond-bond" x1="373" y1="170" x2="407" y2="143"></line>
            <line class="effects-hbond-bond" x1="369" y1="189" x2="407" y2="214"></line>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="429" y="137">O</text>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="430" y="227">O</text>
            <path class="effects-hbond-dotted-bond effects-hbond-dotted-bond--strong" d="M 323 121 C 356 118, 391 127, 416 145"></path>
            <text class="effects-hbond-small-note" x="281" y="360">intramolecular H bond</text>
        </g>
    `;
}

function createParaNitrophenolPair() {
    return `
        <g class="effects-hbond-molecule effects-hbond-molecule--small">
            ${createBenzeneRing(600, 184, 48)}
            <line class="effects-hbond-bond" x1="600" y1="136" x2="600" y2="98"></line>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="600" y="84">O</text>
            <line class="effects-hbond-bond" x1="618" y1="82" x2="651" y2="84"></line>
            <text class="effects-hbond-atom" x="671" y="90">H</text>
            <line class="effects-hbond-bond" x1="600" y1="232" x2="600" y2="270"></line>
            <text class="effects-hbond-atom" x="600" y="295">N</text>
            <line class="effects-hbond-bond" x1="582" y1="307" x2="552" y2="330"></line>
            <line class="effects-hbond-bond" x1="617" y1="307" x2="647" y2="330"></line>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="531" y="348">O</text>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="668" y="348">O</text>
        </g>
        <g class="effects-hbond-molecule effects-hbond-molecule--small effects-hbond-molecule--faded">
            ${createBenzeneRing(752, 286, 48)}
            <line class="effects-hbond-bond" x1="752" y1="238" x2="752" y2="200"></line>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="752" y="186">O</text>
            <line class="effects-hbond-bond" x1="770" y1="184" x2="803" y2="186"></line>
            <text class="effects-hbond-atom" x="823" y="192">H</text>
            <line class="effects-hbond-bond" x1="752" y1="334" x2="752" y2="372"></line>
            <text class="effects-hbond-atom" x="752" y="397">N</text>
            <line class="effects-hbond-bond" x1="734" y1="409" x2="704" y2="432"></line>
            <line class="effects-hbond-bond" x1="769" y1="409" x2="799" y2="432"></line>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="683" y="450">O</text>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="820" y="450">O</text>
        </g>
        <path class="effects-hbond-dotted-bond effects-hbond-dotted-bond--strong" d="M 688 91 C 725 109, 744 139, 752 168"></path>
        <path class="effects-hbond-dotted-bond" d="M 650 341 C 675 348, 702 370, 729 395"></path>
        <text class="effects-hbond-small-note" x="682" y="405">intermolecular H bonds</text>
    `;
}

function createBenzeneRing(cx, cy, radius) {
    const points = Array.from({ length: 6 }, (_, index) => {
        const angle = (-90 + index * 60) * Math.PI / 180;

        return {
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
        };
    });
    const pointString = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
    const innerRadius = radius * 0.55;
    const innerPoints = Array.from({ length: 6 }, (_, index) => {
        const angle = (-90 + index * 60) * Math.PI / 180;

        return {
            x: cx + Math.cos(angle) * innerRadius,
            y: cy + Math.sin(angle) * innerRadius,
        };
    });

    return `
        <polygon class="effects-hbond-ring" points="${pointString}"></polygon>
        <line class="effects-hbond-ring-bond" x1="${innerPoints[0].x}" y1="${innerPoints[0].y}" x2="${innerPoints[1].x}" y2="${innerPoints[1].y}"></line>
        <line class="effects-hbond-ring-bond" x1="${innerPoints[2].x}" y1="${innerPoints[2].y}" x2="${innerPoints[3].x}" y2="${innerPoints[3].y}"></line>
        <line class="effects-hbond-ring-bond" x1="${innerPoints[4].x}" y1="${innerPoints[4].y}" x2="${innerPoints[5].x}" y2="${innerPoints[5].y}"></line>
    `;
}

function initEffectsHbondCarboxylicDimer(container) {
    if (container.dataset.effectsHbondReady === "true") {
        return;
    }

    container.dataset.effectsHbondReady = "true";
    container.classList.add("effects-hbond-component");
    container.innerHTML = `
        <div class="effects-hbond-stage">
            ${createCarboxylicDimerSvg()}
        </div>
    `;
}

function createCarboxylicDimerSvg() {
    return `
        <svg class="effects-hbond-svg effects-hbond-dimer-svg" viewBox="0 0 900 420" role="img" aria-labelledby="effects-hbond-dimer-title effects-hbond-dimer-desc">
            <title id="effects-hbond-dimer-title">Ethanoic acid dimer</title>
            <desc id="effects-hbond-dimer-desc">
                Two ethanoic acid molecules face each other and are held together by two hydrogen bonds to form a carboxylic acid dimer.
            </desc>
            <rect class="effects-hbond-bg" x="0" y="0" width="900" height="420"></rect>
            <text class="effects-hbond-title" x="450" y="38">Ethanoic acid dimer in a non-polar solvent</text>
            ${createEthanoicAcidLeft()}
            ${createEthanoicAcidRight()}
            <path class="effects-hbond-dotted-bond effects-hbond-dotted-bond--strong" d="M 407 199 C 467 250, 548 278, 633 288"></path>
            <path class="effects-hbond-dotted-bond effects-hbond-dotted-bond--strong" d="M 493 199 C 433 148, 352 120, 267 110"></path>
            <text class="effects-hbond-small-note" x="450" y="327">two hydrogen bonds</text>
            <text class="effects-hbond-small-note effects-hbond-small-note--muted" x="450" y="362">apparent Mr about doubles</text>
        </svg>
    `;
}

function createEthanoicAcidLeft() {
    return `
        <g class="effects-hbond-molecule">
            <text class="effects-hbond-formula" x="150" y="208">CH3</text>
            <text class="effects-hbond-atom" x="250" y="208">C</text>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="250" y="98">O</text>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="358" y="208">O</text>
            <text class="effects-hbond-atom" x="398" y="208">H</text>
            <line class="effects-hbond-bond" x1="183" y1="198" x2="226" y2="198"></line>
            <line class="effects-hbond-bond" x1="244" y1="180" x2="244" y2="120"></line>
            <line class="effects-hbond-bond" x1="256" y1="180" x2="256" y2="120"></line>
            <line class="effects-hbond-bond" x1="272" y1="198" x2="335" y2="198"></line>
            <line class="effects-hbond-bond" x1="374" y1="198" x2="387" y2="198"></line>
        </g>
    `;
}

function createEthanoicAcidRight() {
    return `
        <g class="effects-hbond-molecule">
            <text class="effects-hbond-formula" x="750" y="208">CH3</text>
            <text class="effects-hbond-atom" x="650" y="208">C</text>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="650" y="318">O</text>
            <text class="effects-hbond-atom effects-hbond-atom--oxygen" x="542" y="208">O</text>
            <text class="effects-hbond-atom" x="502" y="208">H</text>
            <line class="effects-hbond-bond" x1="674" y1="198" x2="717" y2="198"></line>
            <line class="effects-hbond-bond" x1="644" y1="226" x2="644" y2="286"></line>
            <line class="effects-hbond-bond" x1="656" y1="226" x2="656" y2="286"></line>
            <line class="effects-hbond-bond" x1="565" y1="198" x2="628" y2="198"></line>
            <line class="effects-hbond-bond" x1="513" y1="198" x2="527" y2="198"></line>
        </g>
    `;
}

function initEffectsHbondIceWater(container) {
    if (container.dataset.effectsHbondReady === "true") {
        return;
    }

    container.dataset.effectsHbondReady = "true";
    container.classList.add("effects-hbond-component");
    container.innerHTML = `
        <div class="effects-hbond-stage">
            ${createIceWaterSvg()}
        </div>
    `;
}

function createIceWaterSvg() {
    return `
        <svg class="effects-hbond-svg effects-hbond-ice-water-svg" viewBox="0 0 900 500" role="img" aria-labelledby="effects-hbond-ice-title effects-hbond-ice-desc">
            <title id="effects-hbond-ice-title">Ice has a more open structure than liquid water</title>
            <desc id="effects-hbond-ice-desc">
                Ice is shown as an open hydrogen-bonded lattice with empty spaces, while liquid water is shown as a more random arrangement with molecules closer together.
            </desc>
            <rect class="effects-hbond-bg" x="0" y="0" width="900" height="500"></rect>
            <line class="effects-hbond-divider" x1="450" y1="54" x2="450" y2="445"></line>
            <text class="effects-hbond-title" x="225" y="38">Ice</text>
            <text class="effects-hbond-title" x="675" y="38">Liquid water</text>
            <g class="effects-hbond-empty-space" aria-hidden="true">
                <ellipse cx="224" cy="250" rx="54" ry="70"></ellipse>
                <ellipse cx="315" cy="193" rx="34" ry="44"></ellipse>
                <ellipse cx="314" cy="333" rx="38" ry="42"></ellipse>
            </g>
            <g class="effects-hbond-ice-network">
                <line x1="122" y1="155" x2="248" y2="112"></line>
                <line x1="248" y1="112" x2="356" y2="171"></line>
                <line x1="122" y1="155" x2="166" y2="304"></line>
                <line x1="356" y1="171" x2="315" y2="323"></line>
                <line x1="166" y1="304" x2="315" y2="323"></line>
                <line x1="248" y1="112" x2="166" y2="304"></line>
                <line x1="356" y1="171" x2="248" y2="112"></line>
            </g>
            ${createWaterSymbol(122, 155, -22)}
            ${createWaterSymbol(248, 112, 18)}
            ${createWaterSymbol(356, 171, -14)}
            ${createWaterSymbol(166, 304, 24)}
            ${createWaterSymbol(315, 323, -18)}
            <text class="effects-hbond-small-note" x="224" y="424">open lattice with empty spaces</text>
            <g class="effects-hbond-liquid-network">
                <line x1="560" y1="151" x2="658" y2="184"></line>
                <line x1="658" y1="184" x2="752" y2="148"></line>
                <line x1="592" y1="265" x2="706" y2="248"></line>
                <line x1="706" y1="248" x2="778" y2="321"></line>
                <line x1="546" y1="344" x2="642" y2="342"></line>
                <line x1="642" y1="342" x2="742" y2="284"></line>
                <line x1="604" y1="205" x2="592" y2="265"></line>
                <line x1="742" y1="284" x2="778" y2="321"></line>
            </g>
            ${createWaterSymbol(560, 151, 12)}
            ${createWaterSymbol(658, 184, -34)}
            ${createWaterSymbol(752, 148, 28)}
            ${createWaterSymbol(592, 265, -8)}
            ${createWaterSymbol(706, 248, 36)}
            ${createWaterSymbol(778, 321, -28)}
            ${createWaterSymbol(546, 344, 22)}
            ${createWaterSymbol(642, 342, -38)}
            ${createWaterSymbol(742, 284, 6)}
            <text class="effects-hbond-small-note" x="675" y="424">molecules closer together</text>
        </svg>
    `;
}

function createWaterSymbol(x, y, rotation = 0) {
    return `
        <g class="effects-hbond-water-symbol" transform="translate(${x} ${y}) rotate(${rotation})">
            <line class="effects-hbond-water-bond" x1="-9" y1="6" x2="-30" y2="28"></line>
            <line class="effects-hbond-water-bond" x1="9" y1="6" x2="30" y2="28"></line>
            <circle class="effects-hbond-water-oxygen" cx="0" cy="0" r="19"></circle>
            <circle class="effects-hbond-water-hydrogen" cx="-34" cy="32" r="11"></circle>
            <circle class="effects-hbond-water-hydrogen" cx="34" cy="32" r="11"></circle>
            <text class="effects-hbond-water-label" x="0" y="6">O</text>
        </g>
    `;
}

function initEffectsHbondSurfaceTension(container) {
    if (container.dataset.effectsHbondReady === "true") {
        return;
    }

    container.dataset.effectsHbondReady = "true";
    container.classList.add("effects-hbond-component");
    container.innerHTML = `
        <div class="effects-hbond-stage">
            ${createSurfaceTensionSvg()}
        </div>
    `;
}

function createSurfaceTensionSvg() {
    return `
        <svg class="effects-hbond-svg effects-hbond-surface-svg" viewBox="0 0 900 360" role="img" aria-labelledby="effects-hbond-surface-title effects-hbond-surface-desc">
            <title id="effects-hbond-surface-title">Hydrogen bonding at the water surface</title>
            <desc id="effects-hbond-surface-desc">
                Water molecules at the surface are linked by hydrogen bonds to neighbouring water molecules, giving the surface layer high surface tension.
            </desc>
            <rect class="effects-hbond-bg" x="0" y="0" width="900" height="360"></rect>
            <path class="effects-hbond-water-surface" d="M 64 115 C 158 96, 236 134, 330 115 S 502 96, 596 115 S 742 134, 836 115"></path>
            <text class="effects-hbond-title" x="450" y="43">Hydrogen bonding at the surface</text>
            <text class="effects-hbond-small-note" x="148" y="91">surface layer</text>
            <g class="effects-hbond-surface-links">
                <line x1="170" y1="128" x2="282" y2="128"></line>
                <line x1="282" y1="128" x2="394" y2="128"></line>
                <line x1="394" y1="128" x2="506" y2="128"></line>
                <line x1="506" y1="128" x2="618" y2="128"></line>
                <line x1="618" y1="128" x2="730" y2="128"></line>
                <line x1="226" y1="213" x2="338" y2="224"></line>
                <line x1="452" y1="226" x2="566" y2="214"></line>
                <line x1="338" y1="224" x2="452" y2="226"></line>
                <line x1="566" y1="214" x2="674" y2="231"></line>
            </g>
            ${createWaterSymbol(170, 128, -18)}
            ${createWaterSymbol(282, 128, 14)}
            ${createWaterSymbol(394, 128, -12)}
            ${createWaterSymbol(506, 128, 18)}
            ${createWaterSymbol(618, 128, -16)}
            ${createWaterSymbol(730, 128, 14)}
            ${createWaterSymbol(226, 213, 26)}
            ${createWaterSymbol(338, 224, -24)}
            ${createWaterSymbol(452, 226, 10)}
            ${createWaterSymbol(566, 214, -18)}
            ${createWaterSymbol(674, 231, 22)}
            <text class="effects-hbond-small-note" x="450" y="318">strong attractions make the surface difficult to disturb</text>
        </svg>
    `;
}

function injectEffectsHbondStyles() {
    if (document.getElementById("effects-hbond-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "effects-hbond-styles";
    style.textContent = `
        .effects-hbond-component {
            width: 100%;
            max-width: 940px;
            margin: 1.25rem 0;
        }

        .effects-hbond-stage {
            overflow: hidden;
            border: 1px solid #dde3ea;
            border-radius: 8px;
            background: #ffffff;
        }

        .effects-hbond-svg {
            display: block;
            width: 100%;
            height: auto;
            min-height: 260px;
            background: #ffffff;
        }

        .effects-hbond-bg {
            fill: #ffffff;
        }

        .effects-hbond-title {
            fill: #111827;
            font: 800 20px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .effects-hbond-small-note {
            fill: #334155;
            paint-order: stroke;
            stroke: #ffffff;
            stroke-linejoin: round;
            stroke-width: 5;
            font: 700 14px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .effects-hbond-small-note--muted {
            fill: #64748b;
            font-weight: 600;
        }

        .effects-hbond-axis,
        .effects-hbond-bond,
        .effects-hbond-ring,
        .effects-hbond-ring-bond,
        .effects-hbond-divider {
            stroke: #334155;
            stroke-linecap: round;
        }

        .effects-hbond-axis {
            stroke-width: 2.2;
        }

        .effects-hbond-axis-label {
            fill: #334155;
            font: 700 14px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .effects-hbond-grid line {
            stroke: #e2e8f0;
            stroke-width: 1.2;
        }

        .effects-hbond-grid text {
            fill: #64748b;
            font: 700 13px Roboto, Arial, sans-serif;
            text-anchor: end;
        }

        .effects-hbond-grid--zero line {
            stroke: #94a3b8;
            stroke-width: 1.8;
        }

        .effects-hbond-bar {
            fill: #93c5fd;
            stroke: #2563eb;
            stroke-width: 1.4;
        }

        .effects-hbond-bar--highlight {
            fill: #fed7aa;
            stroke: #ea580c;
        }

        .effects-hbond-value,
        .effects-hbond-x-label,
        .effects-hbond-bar-tag,
        .effects-hbond-legend text {
            fill: #111827;
            font: 800 14px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .effects-hbond-x-label {
            font-size: 15px;
        }

        .effects-hbond-bar-tag {
            fill: #9a3412;
            font-size: 12px;
        }

        .effects-hbond-trend-line {
            fill: none;
            stroke: #475569;
            stroke-dasharray: 7 7;
            stroke-linecap: round;
            stroke-width: 2.4;
        }

        .effects-hbond-legend text {
            text-anchor: start;
            font-size: 13px;
        }

        .effects-hbond-legend-swatch--highlight {
            fill: #fed7aa;
            stroke: #ea580c;
        }

        .effects-hbond-legend-swatch--ordinary {
            fill: #93c5fd;
            stroke: #2563eb;
        }

        .effects-hbond-divider {
            stroke: #e2e8f0;
            stroke-width: 2;
        }

        .effects-hbond-ring {
            fill: #f8fafc;
            stroke-width: 3.2;
        }

        .effects-hbond-ring-bond {
            stroke-width: 2.4;
        }

        .effects-hbond-bond {
            stroke-width: 3.2;
        }

        .effects-hbond-atom,
        .effects-hbond-formula {
            fill: #111827;
            paint-order: stroke;
            stroke: #ffffff;
            stroke-linejoin: round;
            stroke-width: 5;
            font: 900 24px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .effects-hbond-formula {
            font-size: 23px;
        }

        .effects-hbond-atom--oxygen {
            fill: #dc2626;
        }

        .effects-hbond-dotted-bond {
            fill: none;
            stroke: #7c3aed;
            stroke-dasharray: 8 8;
            stroke-linecap: round;
            stroke-width: 3.2;
        }

        .effects-hbond-dotted-bond--strong {
            stroke-width: 3.8;
        }

        .effects-hbond-molecule--faded {
            opacity: 0.82;
        }

        .effects-hbond-empty-space ellipse {
            fill: #eef2ff;
            opacity: 0.7;
            stroke: #c7d2fe;
            stroke-dasharray: 5 7;
            stroke-width: 1.4;
        }

        .effects-hbond-ice-network line,
        .effects-hbond-liquid-network line,
        .effects-hbond-surface-links line {
            stroke: #7c3aed;
            stroke-dasharray: 6 7;
            stroke-linecap: round;
            stroke-width: 2.5;
            opacity: 0.82;
        }

        .effects-hbond-water-bond {
            stroke: #64748b;
            stroke-linecap: round;
            stroke-width: 3.2;
        }

        .effects-hbond-water-oxygen {
            fill: #fecaca;
            stroke: #991b1b;
            stroke-width: 1.5;
        }

        .effects-hbond-water-hydrogen {
            fill: #f8fafc;
            stroke: #64748b;
            stroke-width: 1.3;
        }

        .effects-hbond-water-label {
            fill: #111827;
            font: 900 15px Roboto, Arial, sans-serif;
            text-anchor: middle;
        }

        .effects-hbond-water-surface {
            fill: none;
            stroke: #38bdf8;
            stroke-linecap: round;
            stroke-width: 5;
        }

        @media (max-width: 640px) {
            .effects-hbond-svg {
                min-height: 240px;
            }

            .effects-hbond-surface-svg {
                min-height: 210px;
            }
        }
    `;

    document.head.appendChild(style);
}

if (window.document$?.subscribe) {
    window.document$.subscribe(initEffectsOfHydrogenBonding);
} else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEffectsOfHydrogenBonding);
} else {
    initEffectsOfHydrogenBonding();
}
