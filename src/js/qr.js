/*



*** VERY IMPORTANT 👇 ***



* 🚀 Projekt: Memory Shift - Learn smarter
* 📜 Urheberrecht © 2024 WebByte Studio (Timon Schroth). Alle Rechte vorbehalten.
* 🌐 Website: https://memoryshift.app
*
* ❗ Dieses Programm ist urheberrechtlich geschützt. Es darf ohne ausdrückliche schriftliche
* Genehmigung von WebByte Studio weder kopiert, vervielfältigt, verbreitet noch in
* irgendeiner Weise verwendet oder verändert werden.
*
* ❗ Jede unautorisierte Nutzung, einschließlich des Kopierens, Veränderns, oder des
* Vertriebs, ist untersagt und kann zivil- und strafrechtlich verfolgt werden.
*
* 📬 Kontakt: service@webbyte.studio



*/


/* --- QR CODE SUPPORT --- */



function qr(data) {
    
    let content = data.content;
    let color_1 = data.color_1;
    let color_2 = data.color_2;

    let qr_constructor = {
        type: "svg",
        shape: "square",
        width: 1024,
        height: 1024,
        data: content,
        margin: 0,
        qrOptions: {
            typeNumber: "0",
            mode: "Byte",
            errorCorrectionLevel: "L"
        },
        dotsOptions: {
            type: "dots",
            color: color_1,
            roundSize: true
        },
        backgroundOptions: {
            round: 0,
            color: color_2
        },
        cornersSquareOptions: {
            type: "extra-rounded",
            color: color_1
        },
        cornersDotOptions: {
            color: color_1
        }
    };

    const qrCode = new QRCodeStyling(qr_constructor);

    let container = document.getElementById(data.elmnt_id);
    if (!container) {
        container = document.createElement("div");
        container.id = data.elmnt_id;
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        document.body.appendChild(container);
    }

    qrCode.append(container);

    const svgElement = container.querySelector("svg");
    if (svgElement) {
        svgElement.removeAttribute("width");
        svgElement.removeAttribute("height");
        const bbox = svgElement.getBBox();
        svgElement.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        if (qr_constructor.margin === 0) {
            svgElement.style.overflow = "visible";
        }
    }

}




/* ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨ */
/*
/*
/*    🔥💻 Powered by WebByte Studio 💻🔥
/*                                        
/*    💬 Join the Discord: https://discord.gg/53SverZQtV
/*    📹 Follow on Instagram: instagram.com/webbytestudio
/*    📞 Connect on WhatsApp: https://whatsapp.com/channel/0029Vasl8IAAInPl5pZifL1E
/*
/*
/* ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨ */


