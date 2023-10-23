
//  Gestione giocatori
//
//         la funziona di stampa classifica deve essere riportata nel js che lo lancia

var getEloRun = false;
var calcolaClassificaGiocatoriRun = false;

var giocatori = [];
var bannati = [];

function getAvatar() {
    //Cerco avatar
    for (var username in giocatori) {
        getAvatarUrl('https://api.chess.com/pub/player/' + username);
    }
}     

function getAvatarUrl(url)
{
    //Eseguo funzione per ricercare un avatar
    $.getJSON(url,function(dataAvatar){
        if (dataAvatar.avatar) {
            giocatori[dataAvatar.username].avatar = dataAvatar.avatar;
        } else {
            giocatori[dataAvatar.username].avatar = "https://betacssjs.chesscomfiles.com/bundles/web/images/user-image.152ee336.svg";
        }
        giocatori[dataAvatar.username].url = dataAvatar.url;
        giocatori[dataAvatar.username].displayName = dataAvatar.url.substr(29, dataAvatar.url.length-29);

        //Se non ho caricato tuti gli avatar esengo ancora la funzione
        for (var username in giocatori) {
            if (! giocatori[username].avatar) {
                return;
            }
        }
  
        //Finito calcolo. Scrivo i risultati 
        //   Controllo se è già partita la fase di scrittura
        //      se arrivano contemporaneamente più caricamenti potrebbe succedere
        if (! getEloRun)
        {
            getEloRun = true;
            getElo();
        }
    }).error(function(jqXhr, textStatus, error) {
        //è andato in errore ricarico i dati
        getAvatarUrl(this.url);    
        //Per evitare problemi se il giocatore è non esiste,
        //  se va in errore carico l'avatar di default
        //Tolto se il giocatore va in errore bisogna correggere anche stat
        //var username = this.url.substr(33, this.url.length - 32);
        //giocatori[username.toLowerCase()].avatar = "https://betacssjs.chesscomfiles.com/bundles/web/images/user-image.152ee336.svg";

    });

}

function getElo()
{
    //Cerco l'avatar per tutti i giocatori
    for (var username in giocatori) {
        sleep(5);
        //Cerco avatar
        getEloUrl('https://api.chess.com/pub/player/' + username + '/stats');
    }    
}

function getEloUrl(url)
{
    //Eseguo funzione per ricercare un avatar
    $.getJSON(url,function(data){
        var username = ''
        username = this.url.substr(33, this.url.length-39);
        if (data.chess_daily)
            giocatori[username].elo = data.chess_daily.last.rating;
        else
            giocatori[username].elo = 1200;    
            
        //Se non ho caricato tuti gli elo  esengo ancora la funzione
        for (var username in giocatori) {
            if (! giocatori[username].elo) {
                return;
            }
        }

        if (calcolaClassificaGiocatoriRun)
            return;
            calcolaClassificaGiocatoriRun = true;

        //Calcolo clasifica dei giocatori
        calcolaClassificaGiocatori();

    }).error(function(jqXhr, textStatus, error) {
        //è andato in errore ricarico i dati
        getEloUrl(this.url);    
    });

}

function creaGiocatore(apiUsername, squadra) {
    //Uso apiUsername perchè così posso inviare sia username che displayname
    var username = apiUsername.toLowerCase()
    giocatori[username] = {};
    giocatori[username].username = username;
    giocatori[username].url = '';
    giocatori[username].squadra = squadra;
    giocatori[username].displayName = '';
    giocatori[username].presenze = '';
    //lo assegno quando lo trovo giocatori[username].avatar = '';
    //lo assegno quando lo trovo giocatori[username].elo = 0;
    giocatori[username].punti = 0;
    giocatori[username].puntiSpareggio = 0;
    giocatori[username].posizione = 0;
    giocatori[username].vinte = 0;
    giocatori[username].perse = 0;
    giocatori[username].patte = 0;
    giocatori[username].userVinte = [];
    giocatori[username].userPatte = [];
    giocatori[username].giocatoCampionato = false;
    for (var userPresenza in presenze) {
//        console.log(username + ' - ' + presenze[userPresenza].username);
        if (username == presenze[userPresenza].username) {
//            console.log('TROVATO');
            giocatori[username].g1 = presenze[userPresenza].g1;
            giocatori[username].g2 = presenze[userPresenza].g2;
            giocatori[username].g3 = presenze[userPresenza].g3;
            giocatori[username].g4 = presenze[userPresenza].g4;
            giocatori[username].g5 = presenze[userPresenza].g5;
            giocatori[username].g6 = presenze[userPresenza].g6;
            giocatori[username].g7 = presenze[userPresenza].g7;
            giocatori[username].presenzeTot = 0;            
            if (squadra == '') {
                console.log('------------------------- SQUADRA NON TROVATA: ' + username);
                console.log('------------------------- SQUADRA NON TROVATA: ' + username);
                console.log('------------------------- SQUADRA NON TROVATA: ' + username);
                console.log('------------------------- SQUADRA NON TROVATA: ' + username);
                console.log('------------------------- SQUADRA NON TROVATA: ' + username);
                continue;
            }

            if (presenze[userPresenza].g1 == '1' || presenze[userPresenza].g1 == '2') {
                giocatori[username].presenzeTot += 1; 
                if (squadra != '') teams[squadra].giocatoriRegistrati +=  1;
            }
            if (presenze[userPresenza].g2 == '1' || presenze[userPresenza].g2 == '2') {
                giocatori[username].presenzeTot += 1; 
                if (squadra != '') teams[squadra].giocatoriRegistrati +=  1;
            }
            if (presenze[userPresenza].g3 == '1' || presenze[userPresenza].g3 == '2') {
                giocatori[username].presenzeTot += 1; 
                if (squadra != '') teams[squadra].giocatoriRegistrati +=  1;
            }
            if (presenze[userPresenza].g4 == '1' || presenze[userPresenza].g4 == '2') {
                giocatori[username].presenzeTot += 1; 
                if (squadra != '') teams[squadra].giocatoriRegistrati +=  1;
            }
            if (presenze[userPresenza].g5 == '1' || presenze[userPresenza].g5 == '2')  {
                giocatori[username].presenzeTot += 1; 
                teams[squadra].giocatoriRegistrati +=  1;
            }
            if (presenze[userPresenza].g6 == '1' || presenze[userPresenza].g6 == '2') {
                giocatori[username].presenzeTot += 1; 
                if (squadra != '') teams[squadra].giocatoriRegistrati +=  1;
            }
            if (presenze[userPresenza].g7 == '1' || presenze[userPresenza].g7 == '2') {
                giocatori[username].presenzeTot += 1; 
                if (squadra != '') teams[squadra].giocatoriRegistrati +=  1;
            }
        }
    };

    //Se si è ritirato da una squadra lo metto tra i bannati
    if (squadra == '')
        bannati.push(apiUsername);
}

function setPunti(username, risultato)
{
    //Se non esiste lo creo
    if (! giocatori[username]) {
        creaGiocatore(username, '');  //Se viene creato qui vuol dire che si è ritirato dalla squadra
    }

    //Se risultato non definito la partita non è finita
    if (! risultato)
        return;

    console.log('setPunti ' + username  + ' - ' + risultato);
    //aggiorno punteggio
    if ( risultato == 'win') {
        giocatori[username].punti ++;
        giocatori[username].vinte ++;
        //???????? NON POSSO CALCOLARE TIE-BREK
        //giocatori[username].userVinte.push(username2);
    } else {
        if ((risultato == 'agreed') || (risultato == 'repetition')  || (risultato == 'timevsinsufficient') || 
        (risultato == '50move') || (risultato == 'insufficient') || (risultato == 'stalemate')  ){
                giocatori[username].punti += 0.5;
                giocatori[username].patte ++;
                //???????? NON POSSO CALCOLARE TIE-BREK
                //giocatori[username].userPatte.push(username2);
            } else {
                giocatori[username].perse ++;
            }
    }
    console.log('setPunti ' + username  + ' - ' + risultato + ' - ' + giocatori[username].punti.toString());
}

function calcolaClassificaGiocatori()
{
    //calcolo punti spareggio
    /*   Non Usato
    for (var username in giocatori)
    {
        for (var i in giocatori[username].userVinte)
            giocatori[username].puntiSpareggio += giocatori[giocatori[username].userVinte[i]].punti;
        for (var i in giocatori[username].userpatte)
            giocatori[username].puntiSpareggio += giocatori[giocatori[username].userPatte[i]].punti / 2;
    }
    */

    //Imposto posizione e salvo
    var username = '';
    var max = 0;
    var maxSpareggio = 0;
    var maxPresenzeTot = 0;
    var posizione = 0;
    var nPareggi = 0;
    var oldMax = 0;
    var oldSpareggio = 0;
    while (max > -1)
    {
        max = -1;
        maxSpareggio = -1;
        for (var i in giocatori)
        {
            if ((bannati.indexOf(giocatori[i].username) == -1) &&  // stampo tutti per visualizzare le presenze (giocatori[i].giocatoCampionato) &&
               (giocatori[i].posizione == 0) && 
               ( (giocatori[i].punti > max) || (giocatori[i].punti == max && giocatori[i].puntiSpareggio > maxSpareggio) || 
                 (giocatori[i].punti == max) && giocatori[i].puntiSpareggio == maxSpareggio && giocatori[i].presenzeTot > maxPresenzeTot) 
            ) {
                username = i;
                max = giocatori[i].punti;
                maxSpareggio = giocatori[i].puntiSpareggio;
                maxPresenzeTot = giocatori[i].presenzeTot;
            }
        }
        if (max > -1) 
        {
            if (oldMax == max && oldSpareggio == maxSpareggio )
            {
                nPareggi++;
            } else {
                posizione++;
                posizione += nPareggi;
                nPareggi = 0;
                oldMax = max;
                oldSpareggio = maxSpareggio;
            }    
           giocatori[username].posizione = posizione;
           //Stampo il giocatore
           stampaGiocatore(username);
        }
    }
   
        //Calcolo clasifica
        calcolaClassifica();
 }
 
function stampaGiocatore(username)
{
    //console.log('stampaGiocatore: ' + username + ' - ' + giocatori[username].squadra);
    var presenze = '';
    
    if (! giocatori[username].g1) {
        console.log('stampaGiocatore: ' + username + ' - G1 NON VALIDO, ESCO');
        console.log('stampaGiocatore: ' + username + ' - G1 NON VALIDO, ESCO');
        console.log('stampaGiocatore: ' + username + ' - G1 NON VALIDO, ESCO');
    }
    //console.log('stampaGiocatore: ' + username + ' - ' + giocatori[username].g1);
    //console.log('stampaGiocatore: ' + username + ' - ' + giocatori[username].g2);

    if (giocatori[username].g1 == '2')
        presenze += '<td> <img  src="img\\checkOk-2.png">'
    else if (giocatori[username].g1 == '1')
        presenze += '<td> <img  src="img\\checkOk-1.png">'
    else if (giocatori[username].g1 == '0')
        presenze += '<td> <img  src="img\\checkKo.png">'
    else if (giocatori[username].g1 == '=')
        presenze += '<td> <img  src="img\\checkNo.png">'
        else   presenze += '<td></td>';

    if (giocatori[username].g2 == '2')
        presenze += '<td> <img  src="img\\checkOk-2.png">'
    else if (giocatori[username].g2 == '1')
        presenze += '<td> <img  src="img\\checkOk-1.png">'
    else if (giocatori[username].g2 == '0')
        presenze += '<td> <img  src="img\\checkKo.png">'
    else if (giocatori[username].g2 == '=')
        presenze += '<td> <img  src="img\\checkNo.png">'
        else   presenze += '<td></td>';

    if (giocatori[username].g3 == '2')
        presenze += '<td> <img  src="img\\checkOk-2.png">'
    else if (giocatori[username].g3 == '1')
        presenze += '<td> <img  src="img\\checkOk-1.png">'
    else if (giocatori[username].g3 == '0')
        presenze += '<td> <img  src="img\\checkKo.png">'
    else if (giocatori[username].g3== '=')
        presenze += '<td> <img  src="img\\checkNo.png">'
        else   presenze += '<td></td>';

    if (giocatori[username].g4 == '2')
        presenze += '<td> <img  src="img\\checkOk-2.png">'
    else if (giocatori[username].g4 == '1')
        presenze += '<td> <img  src="img\\checkOk-1.png">'
    else if (giocatori[username].g4 == '0')
        presenze += '<td> <img  src="img\\checkKo.png">'
    else if (giocatori[username].g4 == '=')
        presenze += '<td> <img  src="img\\checkNo.png">'
        else   presenze += '<td></td>';

    if (giocatori[username].g5 == '2')
        presenze += '<td> <img  src="img\\checkOk-2.png">'
    else if (giocatori[username].g5 == '1')
        presenze += '<td> <img  src="img\\checkOk-1.png">'
    else if (giocatori[username].g5 == '0')
        presenze += '<td> <img  src="img\\checkKo.png">'
    else if (giocatori[username].g5 == '=')
        presenze += '<td> <img  src="img\\checkNo.png">'
        else   presenze += '<td></td>';

    if (giocatori[username].g6 == '2')
        presenze += '<td> <img  src="img\\checkOk-2.png">'
    else if (giocatori[username].g6 == '1')
        presenze += '<td> <img  src="img\\checkOk-1.png">'
    else if (giocatori[username].g6 == '0')
        presenze += '<td> <img  src="img\\checkKo.png">'
    else if (giocatori[username].g6 == '=')
        presenze += '<td> <img  src="img\\checkNo.png">'
        else   presenze += '<td></td>';

    if (giocatori[username].g7 == '2')
        presenze += '<td> <img  src="img\\checkOk-2.png">'
    else if (giocatori[username].g7 == '1')
        presenze += '<td> <img  src="img\\checkOk-1.png">'
    else if (giocatori[username].g7 == '0')
        presenze += '<td> <img  src="img\\checkKo.png">'
    else if (giocatori[username].g7 == '=')
        presenze += '<td> <img  src="img\\checkNo.png">'
        else   presenze += '<td></td>';
    
    giocatori[username].presenze = presenze;
      //  console.log('stampaGiocatore: ' + username + ' - ' + presenze);

    $("#giocatori1").append('<tr class="classifica-giocatori">' +
        '<td class="classifica-col1">' + giocatori[username].posizione + '</td>' +  
        '<td class="giocatori-col1SEP"></td>' + 
        '<td class="classifica-col2">' +
        '    <table><tr>' +
        '        <td>' +
        '        <img class="classifica-avatar" src="' + giocatori[username].avatar + '">' +
        '    </td>' +
        '    <td width=7px></td>' +
        '    <td><div>' +
        '            <a class="username" href="' + giocatori[username].url + '" target=”_blank”> ' + giocatori[username].displayName + '</a>' +
        '        </div> <div>  (' + giocatori[username].elo + ') </div>' +
        '        </td>' +    
        '    </tr></table>' +
        '</td>' +
        '<td class="classifica-col2">' +
        '    <table><tr>' +
        '        <td>' +
        '        <img class="classifica-avatar" src="' + teams[giocatori[username].squadra].icon + '">' +
        '    </td>' +
        '    <td width=7px></td>' +
        '    <td><div>' +
        '            <a class="username" href="' + teams[giocatori[username].squadra].url + '" target=”_blank”> ' + teams[giocatori[username].squadra].name + '</a>' +
        '        </div> <div>  (' + giocatori[username].elo + ') </div>' +
        '        </td>' +    
        '    </tr></table>' +
        '</td>' +        
        '<td class="classifica-col3">' + giocatori[username].punti +'</td>' +
        '<td class="classifica-col4"> <span class="game-win">' +  giocatori[username].vinte + ' W</span> /'+
        '<span class="game-lost">' +  giocatori[username].perse + ' L</span> /' +
        '<span class="game-draw">' +  giocatori[username].patte + ' D</span>' +
//        '</td>' +
//        presenze +
        '</tr>'
    );
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }     