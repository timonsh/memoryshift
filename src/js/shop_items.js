/*!
* Projekt: Memory Shift - Learn smarter
* Urheberrecht © 2024 WebByte Studio (Timon Schroth). Alle Rechte vorbehalten.
* Website: https://memoryshift.app
*
* Dieses Programm ist urheberrechtlich geschützt. Es darf ohne ausdrückliche schriftliche
* Genehmigung von WebByte Studio weder kopiert, vervielfältigt, verbreitet noch in
* irgendeiner Weise verwendet oder verändert werden.
*
* Jede unautorisierte Nutzung, einschließlich des Kopierens, Veränderns, oder des
* Vertriebs, ist untersagt und kann zivil- und strafrechtlich verfolgt werden.
*
* Kontakt: service@webbyte.studio
*/



const shop_items = {

    themes: [

        {
            name: 'primary-day',
            ui_name: 'Shift Day',
            path: './src/themes/primary-day.css',
            price: 0,
            owned: true,
            display_data: {
                backgroundColor: '#2a45f8',
                child_elmnt_bg: '#1f38de'
            },
            emoji: '🌅'
        },
        {
            name: 'primary-night',
            ui_name: 'Shift Night',
            path: './src/themes/primary-night.css',
            price: 0,
            owned: true,
            display_data: {
                backgroundColor: '#1f38de',
                child_elmnt_bg: '#2a45f8'
            },
            emoji: '🌇'
        },
        {
            name: 'vivid-orchid',
            ui_name: 'Vivid Orchid',
            path: './src/themes/vivid-orchid.css',
            price: 100,
            owned: false,
            display_data: {
                backgroundColor: '#9575cd',
                child_elmnt_bg: '#d5006d'
            },
            emoji: '🌺'
        },
        {
            name: 'jungle-mist',
            ui_name: 'Jungle Mist',
            path: './src/themes/jungle-mist.css',
            price: 100,
            owned: false,
            display_data: {
                backgroundColor: '#1b5e20',
                child_elmnt_bg: '#388e3c'
            },
            emoji: '🌴'
        },
        {
            name: 'polar-blue',
            ui_name: 'Polar Blue',
            path: './src/themes/polar-blue.css',
            price: 150,
            owned: false,
            display_data: {
                backgroundColor: '#0d47a1',
                child_elmnt_bg: '#0091ea'
            },
            emoji: '🧊'
        },
        {
            name: 'mystic-lavender',
            ui_name: 'Mystic Lavender',
            path: './src/themes/mystic-lavender.css',
            price: 200,
            owned: false,
            display_data: {
                backgroundColor: '#6a0dad',
                child_elmnt_bg: '#471b6f'
            },
            emoji: '🪻'
        }


    ]

};