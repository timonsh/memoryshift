/*                                  
                                        
    

      ++++++   +++++++   +++++++        
    +++++++++ +++++++++++++++++++       
   ++++  ++++++++++++++++++ +++++       
   ++    ++++++    ++++++   +++++       
        ++++++     +++++    ++++        
        +++++     +++++     ++++        
        +++++     +++++    +++++        
        ++++      ++++     ++++         
       +++++     +++++     ++++     +   
       ++++      +++++     ++++   +++   
       ++++      ++++      ++++++++++   
       ++++      ++++       +++++++     
                                        
                                        
                                        
    Project: MEMORY SHIFT
    Version: AURORA edge (v4e)
    Creator: WebByte Studio / timonsh
    License: MIT License



*/



let account_import = {
    emoji: '👮',
    headline: 'Hinweis',
    onclick: 'import_account()',
    text: `
                    🗑️ Beim Importieren eines Accounts werden alle bisherigen Daten <b>gelöscht und überschrieben</b>.
                <br><br>
                🚫 Nur Accounts von dir selbst dürfen importiert werden. Das Teilen mit anderen ist <b>strikt
                    untersagt</b>.
                <br><br>
                🔒 Account-Dateien sind mehrfach verschlüsselt. Ein Editierungs-Versuch kann die Datei unwirksam machen.
                <br><br>
                👋 Importiert werden: Vokabellisten, Prüfungen, Zeit / Statistiken, Einstellungen, ShiftCoins, Themes
                und mehr

    `
};

let support_project_info = {
    emoji: '❤',
    headline: 'Support',
    onclick: 'lead_to_donate();',
    custom_btn_text: 'Spenden ☕',
    text: `
    😉 Es freut mich sehr, dass du Memory Shift so viel nutzt!
    <br><br>
    🧑‍💻 Leider fallen bei der Entwicklung Kosten an, die ich als Privatperson übernehmen muss.
    <br><br>
    ☕ Deshalb würde ich mich sehr freuen, wenn du mich auf Buy me a Coffee oder PayPal unterstützen würdest.
    <br><br>
    🙌 Fühl dich aber bitte nicht verpflichtet etwas zu zahlen - das Nutzen & Empfehlen der App hilft schon sehr!
    <br><br>
    💙 Vielen Dank!
    `
};

let join_discord = {
    emoji: '🌟',
    headline: 'Join Discord',
    onclick: 'window.location.href="https://discord.gg/8tBMgJpEKW"',
    custom_btn_text: 'Join ✨',
    text: `
    🎉 Hey, es ist echt mega cool, dass du Memory Shift so fleißig nutzt!
    <br><br>
    🤝 Wusstest du schon? Es gibt einen eigenen Discord-Server, auf dem du dich mit anderen austauschen, Fragen stellen und Feedback geben kannst!
    <br><br>
    🌟 Dort gibt's coole Tipps, Updates und eine kleine Community, die dich beim Lernen unterstützt.
    <br><br>
    💙 Komm vorbei und join dem Discord-Server!
    `
};




// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
//
//
//  MEMORY SHIFT by WEBBYTE STUDIO
//  memoryshift.app
//
//
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿


