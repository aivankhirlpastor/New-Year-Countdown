// initials

let s = "!"

const root = document.documentElement;
const cc = document.getElementById("container");
const ct = document.querySelector("div.countdown-base");
const menu = document.getElementById("menu");
const rootdemo = document.getElementById("demo")

let maincolor = document.getElementById("main");
let primarycolor = document.getElementById("primary");
let secondarycolor = document.getElementById("secondary");
let tertiarycolor = document.getElementById("tertiary");
let quaternarycolor = document.getElementById("quaternary");

// buttons

let gfxBtn = document.getElementById("gfx-settings");
let resetBtn = document.getElementById("reset-default");
let fullscreen = document.getElementById("fullscreen");
let closeCancelBtn = document.getElementById("close-cancel");
let proceedBtn = document.getElementById("on-operation");


// default value
const dv = {
    color: {
        main: "#ffffff",
        primary: "#ff2b64",
        secondary: "#b5ca1a",
        tertiary: "#008dca",
        quaternary: "#00ff6e",
    },
    gfx: {
        textGlow: true,
        boxGlow: true,
        glassEffect: false
    }
};

var user = 0;
var system = {
    screen: {
        fullscreen: false
    },
    time: {
        c: 0,
        entry: new Date(),
        original: 0,
        passes: {
            initials: false,
            newyear: false,
        },
        to: new Date(2025, 11, 31, 23, 57, 48, 0),
    }
};

const resetStyle = () => {
    localStorage.removeItem("styling");
}

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
        document.querySelector("body").setAttribute("data-glass-effect", "true");
        user.gfx.glassEffect = true;
    } else {
        document.querySelector("body").setAttribute("data-glass-effect", "false");
        user.gfx.glassEffect = false;
    };
};

function loadData() {
    // let initialValue = dv;
    user = 0;
    let loadfile = localStorage.getItem('styling');
    
    if (loadfile) {
        console.log("styling data loaded");
        user = JSON.parse(loadfile);
    } else {
        user = dv;
        localStorage.setItem('styling', JSON.stringify(dv));
    }
}


function loadStyle() {
    if (!rootdemo) {
        maincolor.value = user.color.main;
        primarycolor.value = user.color.primary;
        secondarycolor.value = user.color.secondary;
        tertiarycolor.value = user.color.tertiary;
        quaternarycolor.value = user.color.quaternary;
    }

    if (user.gfx.textGlow) {
        document.getElementById("text-glow").setAttribute("checked", "");
    } else {
        document.getElementById("text-glow").removeAttribute("checked");
    };
    
    if (user.gfx.boxGlow) {
        document.getElementById("box-glow").setAttribute("checked", "");
    } else {
        document.getElementById("box-glow").removeAttribute("checked");
    };

    if (user.gfx.glassEffect) {
        document.getElementById("glass-effect").setAttribute("checked", "");
    } else {
        document.getElementById("glass-effect").removeAttribute("checked");
    };

    textGlow();
    boxGlow();
    glassEffect();
}

function renderCountdown(y, mo, dy, h, m, se, ms) {
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

    // format HTML elements

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

    let sC = user.color.quaternary;

    cc.style.setProperty("--main-color", user.color.main);
    let cSepV = parseInt(preCD) >= 1 && se % 2 === 0 || parseInt(preCD) < 1 && ms < 500 ? "." : " ";
    let glowbaseProperty = ms < 500 ? `0 0 38em ${sC}aa, 0 0 18em ${sC}aa, 0 0 ${se / 10}em ${sC}99, 0 0 4em ${sC}88, 0 0 3em #9c9c9ccc, 0 0 20px #9c9c9ccc, 0 0 ${se / 3}px #84848484, 0 0 ${se / 3}px ${sC}ff, 0 0 4px #6b6b6b66` : "none"
    let glowbox = ms < 500 ? `0 0 3em #ffffff80, inset 0 0 15em #9c9c9c20, 0 0 20px #9c9c9ccc, inset 0 0 ${se / 5}px #84848484, inset 0 0 10px #ffffff84, 0 0 4px #6b6b6b66` : "none"

    function glowFlash(mv, sv) {
        let tertiaryGlow = `0 0 50px #87878787, 0 0 ${(11 - mv) * 3}px ${user.color.tertiary}`;
        let quaternaryGlow = `0 0 50px #87878787, 0 0 20px #87878787, 0 0 ${(11 - mv) * 3}px ${sC}`;
        let tickcountGlow = `0 0 ${se / 10}em ${sC}, 0 0 ${se / 3}px #848484, 0 0 ${se / 3}px ${sC}a0`;
                
        if (parseInt(preCD) === 0 && parseInt(preCH) === 0) {
            if (mv === 10 || mv === 5 || mv === 3 || mv === 2 || mv === 1) {
                if (sv === 0) {
                    base2.style.setProperty("--tertiary-blink", ms < 500 ? tertiaryGlow : "none");
                    base3.style.setProperty("--quaternary-blink", ms < 500 ? quaternaryGlow : "none");
                }
            } else if (mv === 0) {
                if (sv <= 10) {
                    base3.style.setProperty("--quaternary-blink", glowbaseProperty);
                    cc.style.setProperty("--boxglow", glowbox);
                } else {
                    base3.style.setProperty("--quaternary-blink", ms < 500 ? tickcountGlow : "none");
                }
            } else {
                base2.style.setProperty("--tertiary-blink", "none");
                base3.style.setProperty("--quaternary-blink", "none");
            }
        }
    }

    if (mo === 0 & dy === 1) {
        label.textContent = spaceConversion("         ");
        separators.textContent = binarySeparator("0000000000");

        base1.textContent = String(y + s).padStart(8, s);
        base1.style.color = "#ffffff"
        base2.textContent = s;
        base3.textContent = s;

        document.querySelector("body").classList.remove("rise");

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


    if (parseInt(preCD) >= 1) {
        // if the DAY is more than or equal to 1

        label.textContent = spaceConversion("  D  H  M");
        separators.textContent = binarySeparator("0001001000");

        base1.textContent = day + s;
        base1.style.color = user.color.primary;

        base2.textContent = hr + s;
        base2.style.color = user.color.secondary;

        base3.textContent = min + s;
        base3.style.color = user.color.tertiary;

    } else if (parseInt(preCD) === 0 && parseInt(preCH) >= 1) {
        // if the DAY is 0 and the HOUR is more than or equal to 1

        label.textContent = spaceConversion("  H  M  S");
        separators.textContent = binarySeparator("0001001000");

        base1.textContent = s + hr + s;
        base1.style.color = user.color.secondary;

        base2.textContent = min + s;
        base2.style.color = user.color.tertiary;

        base3.textContent = sec + s;
        base3.style.color = user.color.quaternary;

    } else if (parseInt(preCD) === 0 && parseInt(preCH) === 0 && parseFloat(preCM) >= 10) {
        // if the DAY and HOUR is 0 and the MINUTE is more than or equal to 10

        label.textContent = spaceConversion("    M  S");
        separators.textContent = binarySeparator("0000010000");

        base1.textContent = "".padStart(3, s);

        base2.textContent = min + s;
        base2.style.color = user.color.tertiary;

        base3.textContent = String(sec + s).padEnd(4, s);
        base3.style.color = user.color.quaternary;

    } else if (parseInt(preCD) === 0 & parseInt(preCH) === 0 && parseInt(preCM) < 10 && 0 < parseInt(preCM)) {
        // if the DAY and HOUR is 0 and the MINUTE is less than 10

        label.textContent = spaceConversion("   M  S");
        separators.textContent = binarySeparator("0000100000");

        base1.textContent = "".padStart(2, s);
        base2.textContent = min + s;
        base2.style.color = user.color.tertiary;

        base3.textContent = String(sec + s).padEnd(5, s);
        base3.style.color = user.color.quaternary;

    } else if (parseInt(preCD) === 0 && parseInt(preCH) === 0 && parseInt(preCM) === 0) {
        // if there are less than 60 SECONDS left

        label.textContent = spaceConversion("     S");
        separators.textContent = binarySeparator("0001000000");

        base1.textContent = "".padStart(3, s);
        base2.textContent = s;
        base3.textContent = String(sec + s).padEnd(6, s);
        base3.style.color = user.color.quaternary;

        document.querySelector("body").classList.add("rise");
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

    let time = new Intl.DateTimeFormat("en-US", {
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

document.getElementById("text-glow").addEventListener("change", () => {
    textGlow();
    localStorage.setItem('styling', JSON.stringify(user));
});

document.getElementById("box-glow").addEventListener("change", () => {
    boxGlow();
    localStorage.setItem('styling', JSON.stringify(user));
});

document.getElementById("glass-effect").addEventListener("change", () => {
    glassEffect();
    localStorage.setItem('styling', JSON.stringify(user));
});

document.getElementById("menu").addEventListener("click", e => {
    if (document.getElementById("block-wall").contains(e.target) || document.querySelector("div#menu h2").contains(e.target)) {
        menu.classList.remove("active");

        setTimeout(() => {
            menu.classList.remove("disclose");
        }, 200);
    }
});

gfxBtn.addEventListener("click", () => {
    menu.classList.add("disclose");
    setTimeout(() => {
        menu.classList.add("active");
    }, 10);
});

resetBtn.addEventListener("click", () => {
    document.getElementById("pop-up").classList.add("show");
});

fullscreen.addEventListener("click", () => {
    if (root.requestFullscreen) {
        root.requestFullscreen();
    } else if (root.webkitRequestFullscreen) {
        root.webkitRequestFullscreen();
    } else if (root.msRequestFullscreen) {
        root.msRequestFullscreen();
    };
})

root.addEventListener("dblclick", () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
})

closeCancelBtn.addEventListener("click", () => {
    document.getElementById("pop-up").classList.remove("show");
});

proceedBtn.addEventListener("click", () => {
    localStorage.removeItem('styling');
    window.location.reload();

    document.getElementById("pop-up").classList.remove("show");

});

if (!rootdemo) {
    maincolor.addEventListener("input", () => {
        user.color.main = `${maincolor.value}`;
        localStorage.setItem('styling', JSON.stringify(user));
    });

    primarycolor.addEventListener("input", () => {
        user.color.primary = `${primarycolor.value}`;
        localStorage.setItem('styling', JSON.stringify(user));
    });

    secondarycolor.addEventListener("input", () => {
        user.color.secondary = `${secondarycolor.value}`;
        localStorage.setItem('styling', JSON.stringify(user));
    });

    tertiarycolor.addEventListener("input", () => {
        user.color.tertiary = `${tertiarycolor.value}`;
        localStorage.setItem('styling', JSON.stringify(user));
    });

    quaternarycolor.addEventListener("input", () => {
        user.color.quaternary = `${quaternarycolor.value}`;
        localStorage.setItem('styling', JSON.stringify(user));
    });
}

setInterval(getTime, 0.4);
loadData();
loadStyle();
