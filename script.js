// initials

let s = "!"

const root = document.documentElement;
const body = document.querySelector("body");
const cc = document.getElementById("container");
const ct = document.querySelector("div.countdown-base");
const menu = document.getElementById("menu");
const rootdemo = document.getElementById("demo")
const toasts = document.createElement("toast-ctr");

let maincolor = document.getElementById("main");
let primarycolor = document.getElementById("primary");
let secondarycolor = document.getElementById("secondary");
let tertiarycolor = document.getElementById("tertiary");
let quaternarycolor = document.getElementById("quaternary");

// buttons

let gfxBtn = document.getElementById("gfx-settings");
let resetBtn = document.getElementById("reset-default");
let fullscreen = document.getElementById("fullscreen");

var user = 0;
var system = {
    act: {
        oldstyle: null
    },
    screen: {
        fullscreen: false,
        method: "click"
    },
    time: {
        c: 0,
        entry: new Date(),
        original: 0,
        passes: {
            initials: false,
            newyear: false,
        },
        to: new Date(2025, 11, 31, 23, 57, 0, 0),
    }
};

// custom element tag
class optionDeck extends HTMLElement {
    constructor() {
        super();
    }
}

class outputToolbar extends HTMLElement {
    constructor() {
        super();
    }
}

class outputMenu extends HTMLElement {
    constructor() {
        super();
    }
}

class fullscreenFloat extends HTMLElement {
    constructor() {
        super();

        this.point = 0;
        this.text = () => {
            return `To exit full screen, press ESC on your keyboard or double ${system.screen.method} anywhere on your screen.`;
        };

        ["pointerdown", "pointermove"].forEach((evt) => {
            document.addEventListener(evt, (e) => {
                if (e.pointerType === "mouse" && this.point !== 0) {
                    this.point = 0;
                    this.textContent = this.text();
                    console.log(this.point, system.screen.method)
                } else if (e.pointerType === "pen" && this.point !== 1 || e.pointerType === "touch" && this.point !== 1) {
                    this.point = 1;
                    this.textContent = this.text();
                }
            })
        });
    }

    connectedCallback() {
        this.textContent = this.text();
        this.classList.add("c");

        setTimeout(() => {
            this.removeAttribute("class");
        }, 250)
    }
}

class toastContainer extends HTMLElement {
    constructor() {
        super();
    }
}

class toastNotification extends HTMLElement {
    constructor() {
        super();

        this.allowOverrideImage = true; // default boolean property
        this.bgOpacity = 55 // Ranges from 0 to 255 on pre-format hexadecimal value.
        this.btnAction = document.createElement("button");
        this.image = document.createElement("img");
        this.inner = document.createElement("div");
        this.length = 8;
        this.transitionEndingLength = 250;
        this.trigger = null;
        this.txt = document.createElement("p");

        this.conceal = () => {
            this.classList.add("conceal");
            this.style.transition = `opacity ${this.transitionEndingLength}ms ease-in-out`

            this.addEventListener("transitionend", () => {
                this.inner.remove();
            })
        }

        // this.root = this.attachShadow({ mode: "open" });
        this.addEventListener("animationend", () => {
            setTimeout(this.conceal, this.length * 1000)
        });

        this.addEventListener("dblclick", this.conceal);
    }

    buildToast(message = { image: undefined, overrideImage: true, text: "paragraph" }, trigger = { text: "Dismiss", action: null }, style = { bannerColor: "#00ff77", bgColor: "#444444", status: null, textColor: "#ffffff" }, length = 8) {
        // Assemble the variables
        const opacity = this.bgOpacity.toString(16);

        this.allowOverrideImage = typeof message.overrideImage === "boolean" ? message.overrideImage : true;
        this.length = length;
        this.style.borderLeftColor = style.bannerColor;
        this.style.backgroundColor = style.bgColor + opacity;
        this.style.color = style.textColor;

        // Append text paragraph for toast label.
        this.txt.textContent = message.text;
        this.appendChild(this.txt);

        switch (style.status) {
            case "error":
                this.style.borderLeftColor = "#ff0000";
                this.style.backgroundColor = "#ff0000" + opacity;
                message.image = this.allowOverrideImage ? "./icons/error.svg" : message.image;
                break;
            case "info":
                this.style.borderLeftColor = "#14d0ff";
                this.style.backgroundColor = "#14d0ff" + opacity;
                break;
            case "success":
                this.style.borderLeftColor = "#3cff3c";
                this.style.backgroundColor = "#3cff3c" + opacity;
                break;
            case "warning":
                this.style.borderLeftColor = "#ffc917";
                this.style.backgroundColor = "#ffc917" + opacity;
                break;
        }

        // Deploy an existing image as an icon.
        if (message.image) {
            fetch(message.image)
                .then(r => {
                    if (!r.ok) {
                        console.log("image deployment has been aborted. Status:", r.status);
                        switch (r.status) {
                            case 404:
                                throw new Error(`${r.status}: Image not found. Toast message continues to be generated without image to be deployed.`);
                        }
                    }
                    this.image.src = message.image;
                    this.insertBefore(this.image, this.children[0]);
                });
        }

        // Define the button trigger
        try {
            // Only if it has a text and an action.
            if (trigger.text && trigger.action) {
                // Check whether a "trigger" value is a function
                if (typeof trigger.action === "function") {
                    this.trigger = trigger.action;
                } else if (trigger.action === "dismiss") {
                    this.trigger = null;
                } else {
                    throw new Error(`The action should be explicitly settled from the list below and must be a function: obtained and declared "${trigger.action}".`);
                }

                this.btnAction.textContent = trigger.text;
                this.btnAction.addEventListener("click", () => {
                    if (this.trigger) {
                        this.trigger();
                    }

                    this.conceal();
                    this.trigger = null; // avoid repeated action on multiple clicks
                })

                this.appendChild(this.btnAction);
            }
        } catch (err) {
            console.error(err.message);
        }

        // Append toast message immediately.
        this.inner.appendChild(this);
        toastMethod(this.inner);
    }

    connectedCallback() {
        const catchctr = document.querySelector("toast-ctr")
        for (let ch = catchctr.childElementCount; ch > 4; ch--) {
            toasts.children[catchctr.childElementCount - ch].children[0].conceal();
        }
    }

    disconnectedCallback() {
        const catchctr = document.querySelector("toast-ctr")
        if (catchctr && !catchctr.childElementCount) {
            toasts.remove();
        }
    }

}

customElements.define("option-deck", optionDeck);
customElements.define("output-toolbar", outputToolbar);
customElements.define("output-menu", outputMenu);
customElements.define("fullscreen-float", fullscreenFloat);
customElements.define("toast-ctr", toastContainer);
customElements.define("toast-notif", toastNotification);

class popUp extends HTMLElement {
    constructor() {
        super();

        this.opt = document.createElement("option-deck");
        this.btns = document.createElement("div");
        this.btns.setAttribute("part", "options");
        this.btnLabels = undefined;

        this.root = this.opt.attachShadow({ mode: "open" });
        this.root.appendChild(this.btns);

        this.trigger = null;

        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" || e.key === "Esc") {
                this.remove();
            }
        })
    }

    render(name = "type", val = "message") {
        try {

            if (name === "type") {
                // generate buttons via type value
                while (this.btns.firstChild) {
                    this.btns.removeChild(this.btns.firstChild);
                };

                if (val === "message") {
                    const b1 = document.createElement("button");
                    b1.textContent = typeof this.btnLabels !== "object" ? this.btnLabels || "Close" : "Close";
                    this.btns.appendChild(b1);

                    b1.addEventListener("click", () => {
                        this.remove();
                    })
                } else if (val === "close-ended") {
                    for (let q = 0; q < 2; q++) {
                        const btn = document.createElement("button");

                        btn.textContent = typeof this.btnLabels === "object" && this.btnLabels[q] ? this.btnLabels[q] : q ? "No" : "Yes";
                        btn.addEventListener("click", () => {
                            q === 0 ? this.trigger() : null;
                            this.remove();
                        })
                        this.btns.appendChild(btn);
                    }
                } else {
                    // Immediately close pop-up message and declare an error
                    // if none of these values match to a current value.
                    this.remove();
                    throw new TypeError(`Invalid "type" choice: obtained '${val}' which is non-existing type for pop-up interface.`);
                }

                // Set an attribute for buttons to render style.
                [...this.btns.children].forEach(e => {
                    e.setAttribute("part", "btn");
                })
            }

            // if (name === "content") {
            //     if (val === "images") {
            //         return;
            //     } else {
            //         return;
            //     }
            // }
            [...this.btns.children].forEach((b) => {
                b.addEventListener("click", () => {
                    concealInterface(true);
                })
            })
        } catch (err) {
            document.createElement("toast-notif").buildToast({
                text: err,
            }, {
                text: "Dismiss",
                action: "dismiss"
            }, {
                status: "error"
            });

            console.error(err);
        }
    }

    kits(attr = { type: "message" }, message = { head: "MESSAGE", par: "" }, trigger) {
        this.btnLabels = attr.btnLabels;
        this.setAttribute('type', attr.type);

        const heading = document.createElement("h2");
        heading.textContent = message.head;

        const paragraphs = document.createElement("p");
        paragraphs.textContent = message.par;

        this.appendChild(heading);
        this.appendChild(paragraphs);

        if (trigger) {
            // Check whether a "trigger" value is a function
            if (typeof trigger === "function") {
                this.trigger = trigger;
            } else {
                this.trigger = this.remove();
                throw Error(`The trigger declaration must be a function. Found and declared "${trigger}" as a ${typeof trigger}.`);
            }
        } else {
            if (attr.type !== "message") {
                this.trigger = this.remove();
                throw Error(`The trigger declaration was not provided and undefined.`);
            }
        }

    }

    connectedCallback() {
        this.appendChild(this.opt);
    }

    static get observedAttributes() {
        return ["type", "content"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this.render(name, newVal);
    }
}

customElements.define("pop-up", popUp);

const textGlow = () => {
    if (document.getElementById("text-glow").checked) {
        ct.setAttribute("data-allow-text-glow", "true");
        user.gfx.textGlow = true;
    } else {
        ct.setAttribute("data-allow-text-glow", "false");
        user.gfx.textGlow = false;
    };
};

const boxGlow = () => {
    if (document.getElementById("box-glow").checked) {
        cc.setAttribute("data-allow-box-glow", "true");
        user.gfx.boxGlow = true;
    } else {
        cc.setAttribute("data-allow-box-glow", "false");
        user.gfx.boxGlow = false;
    };
};

const glassEffect = () => {
    if (document.getElementById("glass-effect").checked) {
        body.setAttribute("data-glass-effect", "true");
        user.gfx.glassEffect = true;
    } else {
        body.setAttribute("data-glass-effect", "false");
        user.gfx.glassEffect = false;
    };
};

const resetStyle = () => {
    let i = getDefault();

    const resetToast = document.createElement("toast-notif");

    if (JSON.stringify(user) !== JSON.stringify(i)) {
        system.act.oldstyle = localStorage.getItem('styling');

        localStorage.setItem('styling', JSON.stringify(i));
        user = i;

        loadStyle();

        resetToast.buildToast({
            text: "Style reset",
            image: "./icons/reset.svg",
            overrideImage: false
        }, {
            text: "Undo",
            action: retrieveStyle
        }, {
            status: "success"
        });
    } else {
        resetToast.buildToast({
            text: "Your style was already at the default style.",
        }, {
            text: "Dismiss",
            action: "dismiss"
        }, {
            status: "error"
        });
    }
}

const retrieveStyle = () => {
    if (!system.act.oldstyle) {
        return;
    }

    user = JSON.parse(system.act.oldstyle);
    localStorage.setItem('styling', system.act.oldstyle);

    system.act.oldstyle = null;
    loadStyle();
}

function concealInterface(forcepull) {
    if (!root.requestFullscreen && !root.webkitRequestFullscreen && !root.msRequestFullscreen) {
        body.classList.add("conceal-method");
        setTimeout(() => {
            if (forcepull) {
                body.removeAttribute("class");
            }

            body.classList.toggle("conceal");
            body.addEventListener("transitionend", () => {
                if (!body.classList.contains("conceal")) {
                    body.removeAttribute("class");
                }
            });

        }, 100);
    }
}

function getPointer(event) {
    if (event.pointerType === "mouse") {
        return "click";
    } else if (event.pointerType === "pen" || event.pointerType === "touch") {
        return "tap";
    }
}

function getDefault() {
    return {
        color: {
            main: "#ffffff",
            primary: "#ff2b64",
            secondary: "#d0e81e",
            tertiary: "#1eb1f0",
            quaternary: "#00ff6e",
        },
        gfx: {
            textGlow: true,
            boxGlow: true,
            glassEffect: false
        }
    };
}

function loadData() {
    let i = getDefault();
    let loadfile = localStorage.getItem('styling');
    let parsed = JSON.parse(loadfile)

    if (loadfile) {
        console.log("styling data loaded");
        user = parsed;
    } else {
        user = i;
        localStorage.setItem('styling', JSON.stringify(i));
    }
}

function reloadData() {
    user = JSON.parse(localStorage.getItem('styling'));
    loadStyle();
}

const loadStyle = () => {
    if (!rootdemo) {
        maincolor.value = user.color.main;
        primarycolor.value = user.color.primary;
        secondarycolor.value = user.color.secondary;
        tertiarycolor.value = user.color.tertiary;
        quaternarycolor.value = user.color.quaternary;
    }

    if (user.gfx.textGlow) {
        document.getElementById("text-glow").checked = true;
    } else {
        document.getElementById("text-glow").checked = false;
    };

    if (user.gfx.boxGlow) {
        document.getElementById("box-glow").checked = true;
    } else {
        document.getElementById("box-glow").checked = false;
    };

    if (user.gfx.glassEffect) {
        document.getElementById("glass-effect").checked = true;
    } else {
        document.getElementById("glass-effect").checked = false;
    };

    textGlow();
    boxGlow();
    glassEffect();
}

function toastMethod(t) {
    const container = document.querySelector("toast-ctr");
    if (!container) {
        body.appendChild(toasts);
    }
    toasts.appendChild(t);
}

function renderCountdown(y, mo, dy, h, m, se, ms) {
    // Format from seconds to sexagesimal systems
    const nextYear = new Date(y + 1, 0, 1, 0, 0, 1, 0);
    let d = nextYear - system.time.c;

    let preCD = Math.floor(d / (1000 * 60 * 60 * 24));
    let preCH = Math.floor((d % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
    let preCM = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    let preCS = Math.floor((d % (1000 * 60)) / 1000);

    let day = preCD > 0 ? String(preCD).padStart(3, s) : String("").padStart(3, s);
    let hr = preCD || preCH > 0 ? preCD >= 1 ? String(preCH).padStart(2, "0") : String(preCH).padStart(2, s) : String("").padStart(2, s);
    let min = preCD || preCH || preCM > 0 ? preCD >= 1 || preCH >= 1 ? String(preCM).padStart(2, "0") : String(preCM).padStart(2, s) : String("").padStart(2, s);
    let sec = preCD >= 1 || preCH >= 1 || preCM >= 1 ? String(preCS).padStart(2, "0") : String(preCS).padStart(2, s);

    // Conversion from binary numbers into designated characters (0 === space, 1 === separator)
    function binarySeparator(s) {
        let r = "";

        for (let p = 0; p < s.length; p++) {
            if (parseInt(s[p])) {
                r += `${cSepV}`;
            } else {
                r += " ";
            }
        }

        return r;
    }

    // Conversion from regular whitespace into no-break space
    function spaceConversion(tx) {
        let r = "";
        let o = tx;

        if (tx.length > 9) {
            o = tx.substring(0, 10);
        }

        for (let c = 0; c < o.length; c++) {
            if (tx[c] === " ") {
                r += " "
            } else {
                r += `${tx[c]}`;
            }
        }

        return r;
    }

    const label = document.getElementById("matrix-label");
    const separators = document.getElementById("separator");

    const base1 = document.getElementById("b-1");
    const base2 = document.getElementById("b-2");
    const base3 = document.getElementById("b-3");
    const base4 = document.getElementById("b-4");

    let sC = user.color.quaternary;

    cc.style.setProperty("--main-color", user.color.main);
    let cSepV = parseInt(preCD) >= 1 && se % 2 === 0 || parseInt(preCD) < 1 && ms < 500 ? "." : " ";
    let glowbaseProperty = ms < 500 ? `0 0 38em ${sC}aa, 0 0 18em ${sC}aa, 0 0 ${se / 10}em ${sC}99, 0 0 4em ${sC}88, 0 0 3em #9c9c9ccc, 0 0 20px #9c9c9ccc, 0 0 ${se / 3}px #84848484, 0 0 ${se / 3}px ${sC}ff, 0 0 4px #6b6b6b66` : "none"
    let glowbox = ms < 500 ? `0 0 3em #ffffff80, inset 0 0 15em #9c9c9c20, 0 0 20px #9c9c9ccc, inset 0 0 ${se / 5}px #84848484, inset 0 0 10px #ffffff84, 0 0 4px #6b6b6b66` : "none"

    function colorStyling() {
        base1.style.color = user.color.primary;
        base2.style.color = user.color.secondary;
        base3.style.color = user.color.tertiary;
        base4.style.color = user.color.quaternary;
    }

    function glowFlash(mv, sv) {
        let tertiaryGlow = `0 0 50px #87878787, 0 0 ${(11 - mv) * 3}px ${user.color.tertiary}`;
        let quaternaryGlow = `0 0 50px #87878787, 0 0 20px #87878787, 0 0 ${(11 - mv) * 3}px ${sC}`;
        let tickcountGlow = `0 0 ${se / 10}em ${sC}, 0 0 ${se / 3}px #848484, 0 0 ${se / 3}px ${sC}a0`;

        if (parseInt(preCD) === 0 && parseInt(preCH) === 0) {
            if (mv === 10 && sv === 0 || mv === 5 && sv === 0 || mv === 3 && sv === 0 || mv === 2 && sv === 0 || mv === 1 && sv === 0) {
                if (sv === 0) {
                    base3.style.setProperty("--tertiary-blink", ms < 500 ? tertiaryGlow : "none");
                    base4.style.setProperty("--quaternary-blink", ms < 500 ? quaternaryGlow : "none");
                }
            } else if (mv === 0) {
                if (sv <= 10) {
                    base4.style.setProperty("--quaternary-blink", glowbaseProperty);
                    cc.style.setProperty("--boxglow", glowbox);
                } else {
                    base4.style.setProperty("--quaternary-blink", ms < 500 ? tickcountGlow : "none");
                }

            } else {
                base3.style.setProperty("--tertiary-blink", "none");
                base4.style.setProperty("--quaternary-blink", "none");
            }

            if (!document.querySelector("body.rise") && mv === 2) {
                body.classList.add("rise");
            }
        }

    }

    if (mo === 0 & dy === 1) {
        label.textContent = spaceConversion("         ");
        separators.textContent = binarySeparator("0000000000");

        base1.style.color = "#ffffff"
        base1.textContent = String(y).padStart(7, s) + "".padEnd(3, s);
        base2.textContent = null;
        base3.textContent = null;
        base4.textContent = null;

        body.classList.remove("rise");

        if (!system.time.passes.newyear) {
            const b = document.getElementById("bases");
            system.time.passes.newyear = true;

            if (h === 0 & m === 0 & se === 0) {
                cc.classList.add("visualglow", "flash");
                cc.style.setProperty("--box-trans", "box-shadow 10s ease");

                b.classList.add("flash");
                b.style.setProperty("--trans", "text-shadow 10s ease");


                setTimeout(() => {
                    cc.classList.remove("flash");
                    cc.style.setProperty("--boxglow", "0 0 3em #ffffff80, inset 0 0 15em #9c9c9c20, 0 0 20px #9c9c9ccc, inset 0 0 15px #84848484, inset 0 0 10px #ffffff84, 0 0 4px #6b6b6b66");

                    b.classList.remove("flash");
                    b.style.setProperty("--text-glow", "0 0 32px #bababa9f, 0 0 16px #ffffff37, 0 0 8px #ffffff56, 0 0 4px #ffffff30");

                    setTimeout(() => {
                        cc.style.setProperty("--box-glow", "boxglow 5s ease infinite alternate")
                        cc.style.setProperty("--box-trans", "none")

                        b.style.setProperty("--glow", "glow 5s ease infinite alternate");
                        b.style.setProperty("--trans", "none");
                    }, 10000);
                }, 500);
            } else {
                cc.classList.add("visualglow");

                cc.style.setProperty("--boxglow", "0 0 3em #ffffff80, inset 0 0 15em #9c9c9c20, 0 0 20px #9c9c9ccc, inset 0 0 15px #84848484, inset 0 0 10px #ffffff84, 0 0 4px #6b6b6b66");
                cc.style.setProperty("--box-glow", "boxglow 5s ease infinite alternate")
                // cc.style.setProperty("--box-trans", "none")

                b.style.setProperty("--text-glow", "0 0 32px #bababa9f, 0 0 16px #ffffff37, 0 0 8px #ffffff56, 0 0 4px #ffffff30");
                b.style.setProperty("--glow", "glow 5s ease infinite alternate");
                // b.style.setProperty("--trans", "none");
            }
        }

        return;
    } else {
        const b = document.getElementById("bases");
        b.style.setProperty("--glow", "none");
        if (mo === 0 && dy === 2) {
            b.style.textShadow = "none";
        }

        system.time.passes.newyear = false;
    }

    colorStyling();

    if (parseInt(preCD) >= 1) {
        // if the DAY is more than or equal to 1

        label.textContent = spaceConversion("  D  H  M");
        separators.textContent = binarySeparator("0001001000");

        base1.textContent = day + s;
        base2.textContent = hr + s;
        base3.textContent = min + s;
        base4.textContent = null;

    } else if (parseInt(preCD) === 0 && parseInt(preCH) >= 1) {
        // if the DAY is 0 and the HOUR is more than or equal to 1

        label.textContent = spaceConversion("  H  M  S");
        separators.textContent = binarySeparator("0001001000");

        base1.textContent = null;
        base2.textContent = s + hr + s;
        base3.textContent = min + s;
        base4.textContent = sec + s;

    } else if (parseInt(preCD) === 0 && parseInt(preCH) === 0 && parseFloat(preCM) >= 10) {
        // if the DAY and HOUR is 0 and the MINUTE is more than or equal to 10

        label.textContent = spaceConversion("    M  S");
        separators.textContent = binarySeparator("0000010000");

        base1.textContent = null;
        base2.textContent = null;
        base3.textContent = min.padStart(5, s) + s;
        base4.textContent = String(sec + s).padEnd(4, s);

    } else if (parseInt(preCD) === 0 & parseInt(preCH) === 0 && parseInt(preCM) < 10 && 0 < parseInt(preCM)) {
        // if the DAY and HOUR is 0 and the MINUTE is less than 10

        label.textContent = spaceConversion("   M  S");
        separators.textContent = binarySeparator("0000100000");

        base1.textContent = null;
        base2.textContent = null;
        base3.textContent = min.padStart(4, s) + s;
        base4.textContent = String(sec + s).padEnd(5, s);

    } else if (parseInt(preCD) === 0 && parseInt(preCH) === 0 && parseInt(preCM) === 0) {
        // if there are less than 60 SECONDS left

        label.textContent = spaceConversion("     S");
        separators.textContent = binarySeparator("0001000000");

        base1.textContent = null;
        base2.textContent = null;
        base3.textContent = "".padStart(4, s);
        base4.textContent = String(sec + s).padEnd(6, s);
    }

    glowFlash(parseInt(preCM), parseInt(preCS));
}

function getTime() {
    let locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    system.time.c = new Date();
    system.time.original = new Date();
    let t = system.time.c;

    if (rootdemo && system.time.to) {
        const dif = system.time.to - (system.time.entry - new Date());
        t = new Date(dif);
        system.time.c = dif;
    } else {
        system.time.c = new Date();
        t = system.time.c;
    }

    let years = t.getFullYear(),
        month = t.getMonth(),
        days = t.getDate(),
        day = t.getDay(),

        hours = t.getHours(),
        minutes = t.getMinutes(),
        seconds = t.getSeconds(),
        milliseconds = t.getMilliseconds();

    renderCountdown(years, month, days, hours, minutes, seconds, milliseconds);

    let time = new Intl.DateTimeFormat(locale, {
        timeStyle: "long",
    }).format(t);

    document.getElementById("date").textContent = new Intl.DateTimeFormat(locale, {
        timeZoneName: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(t);

    cc.style.setProperty("--time", `"${time}"`);
}

// listeners

// checkboxes
["text-glow", "box-glow", "glass-effect"].forEach((id) => {
    document.getElementById(id).addEventListener("change", () => {
        switch (id) {
            case "text-glow":
                textGlow();
                break;
            case "box-glow":
                boxGlow();
                break;
            case "glass-effect":
                glassEffect();
                break;
            default:
                return;
        }

        localStorage.setItem('styling', JSON.stringify(user));
    })
})

document.getElementById("menu").addEventListener("click", e => {
    if (document.getElementById("block-wall").contains(e.target) || document.querySelector("output-menu#menu h2").contains(e.target)) {
        menu.classList.remove("active");

        setTimeout(() => {
            menu.classList.remove("disclose");
        }, 200);
    }
});

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        system.screen.fullscreen = true;
        body.appendChild(document.createElement("fullscreen-float"));
    } else {
        system.screen.fullscreen = false;
        document.querySelector("fullscreen-float").remove();
    }
});

["pointerdown", "pointermove"].forEach((evt) => {
    document.addEventListener(evt, (e) => {
        if (e.pointerType === "mouse") {
            system.screen.method = "click";
        } else if (e.pointerType === "pen" || e.pointerType === "touch") {
            system.screen.method = "tap";
        }
    })
});

gfxBtn.addEventListener("click", () => {
    menu.classList.add("disclose");
    setTimeout(() => {
        menu.classList.add("active");
    }, 10);
});

resetBtn.addEventListener("click", () => {
    const reset = document.createElement("pop-up");

    reset.kits({
        type: "close-ended"
    }, {
        head: "RESET STYLE TO DEFAULT?",
        par: "You are about to reset all of the styles, including the graphic settings, to a default style.",
    }, resetStyle);

    body.appendChild(reset);
});

fullscreen.addEventListener("click", () => {
    if (root.requestFullscreen) {
        root.requestFullscreen();
    } else if (root.webkitRequestFullscreen) {
        root.webkitRequestFullscreen();
    } else if (root.msRequestFullscreen) {
        root.msRequestFullscreen();
    }
})

if (!root.requestFullscreen && !root.webkitRequestFullscreen && !root.msRequestFullscreen) {
    document.querySelector(".fullscreen").remove();
    document.createElement("toast-notif").buildToast({
        text: "The fullscreen is not compatible or supported by the browser you are currently using.",
    }, {
        text: "Dismiss",
        action: "dismiss"
    }, {
        status: "info"
    }, 8);

    body.addEventListener("click", (e) => {
        let li = 0;
        [...body.children].forEach(el => {
            if (el.contains(e.target) && el.id !== "backdrop") {
                li++;
            }
        })

        if (!li) {
            concealInterface();
        }
    })
}

root.addEventListener("dblclick", () => {
    if (system.screen.fullscreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
})

if (!rootdemo) {
    const ordinals = [maincolor, primarycolor, secondarycolor, tertiarycolor, quaternarycolor];

    ordinals.forEach((o) => {
        o.addEventListener("input", () => {
            switch (o) {
                case maincolor:
                    user.color.main = `${maincolor.value}`;
                    break;
                case primarycolor:
                    user.color.primary = `${primarycolor.value}`;
                    break;
                case secondarycolor:
                    user.color.secondary = `${secondarycolor.value}`;
                    break;
                case tertiarycolor:
                    user.color.tertiary = `${tertiarycolor.value}`;
                    break;
                case quaternarycolor:
                    user.color.quaternary = `${quaternarycolor.value}`;
                    break;
                default:
                    return;
            }

            localStorage.setItem('styling', JSON.stringify(user));
        })
    });
}

// update styling when on focus
window.addEventListener("focus", () => {
    reloadData();
});

setInterval(getTime, 0.4);
loadData();
loadStyle();
