var calcolaClassificaRun = false;


//https://api.chess.com/pub/tournament/csp-inverno-2018-2019-girone-1/1/1

function elabora() {

//    var url = 'rapidWeeks2020Test.JSON';
    var url = 'rapidWeeks2020.JSON';

    $.getJSON(url,function(data){

        var iMatch = 0;
        for (var i in data.partite) {
            var partita = data.partite[i];
            if (partita.win != '') {
                iMatch ++;
                setPunti(partita.settimana, partita.win, partita.lost, iMatch);
            }
        }
        
        //Ricerco elo e stampo classifica giocatori
        getAvatar();

        //Calcolo classifica generale
        //calcolaClassifica();
    });

};

//calcolo classifica team
/*
function calcolaClassifica()
{
    //calcolo punti spareggio
    //  SENZA PENALITA'
    /*  NON USATO
    for (var nameTeam in teams)
    {
        for (var i in teams[nameTeam].teamVinte)
            teams[nameTeam].puntiSpareggio += teams[teams[nameTeam].teamVinte[i]].punti;
        for (var i in teams[nameTeam].teamPatte)
            teams[nameTeam].puntiSpareggio += teams[teams[nameTeam].teamPatte[i]].punti / 2;
    }
    */

    /*
    //Tolgo dai punti le penalità per calcolare la classifica
    for (var nameTeam in teams)
    {
        teams[nameTeam].puntiMatchRisolti = teams[nameTeam].puntiConclusi;
        teams[nameTeam].puntiConclusi -= teams[nameTeam].penalità;
    }
    //Imposto posizione e salvo
    var gruppo = '';
    var max = -1;
    var maxSpareggio = 0;
    var posizione = 0;
    var oldMax = -1;
    var oldSpareggio = -1;
    var nPareggi = 0;
    var puntiClassifica = 0;
    while (max > -100)
    {
        max = -200;
        maxSpareggio = -1;
        for (var i in teams)
        {
            //Scelgo i punti (da conclusi oi in corso)
            puntiClassifica = teams[i].puntiConclusi;

            if ((teams[i].posizione == 0) && (puntiClassifica > max || (puntiClassifica == max) && teams[i].puntiSpareggio > maxSpareggio)) {
                gruppo = i;
                max = puntiClassifica;
                maxSpareggio = teams[i].puntiSpareggio;
            }
        }
        if (max > -100) 
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
            teams[gruppo].posizione = posizione;
            //Aggiungo il team nella posizione corretta
            classificaTeams.push(gruppo);
        }
    }

    //Stampo la classifica
    var url  = '';
    var stile = '';
    var stileTD = '';
    var gruppoAvversario = '';
    var risultato = '';
    var boards = '';
    var score1 = 0;
    var score2 = 0;
    var partitaConclusa = false;
    //Riga con nomi teams    
    var stRiga = '<tr class="classifica-nameTeam">' +
            '<td style="background-color:gray;"></td><td style="background-color:gray;"></td><td style="background-color:gray;">' + 
            //'</td><td style="background-color:gray;">'+
            '</td><td style="background-color:gray;"></td></td><td style="background-color:gray;"></td></td><td style="background-color:gray;"></td>' +
            '<td class="classifica-col1SEP"></td>'; 
    for (var i in classificaTeams)         
        stRiga += '<td class="classifica-nameTeam"> <a style="color:black;text-decoration: none;font-weight: normal;" href="' + teams[classificaTeams[i]].url + '" target=”_blank”> ' + teams[classificaTeams[i]].name + '</a></td>';
    stRiga += '</tr>'
    $("#classifica").append(stRiga);
    //Riga con Icone    
    stRiga = '<tr class="classifica-icon">' +
            '<td class="classifica-icon" style="background-color:#E2E2FF;">Pos.</td> <td style="background-color:#E2E2FF;">Team</td><td style="background-color:#E2E2FF;"></td>'+
            '<td class="classifica-icon">Punti</td>' +
            //'<td class="classifica-icon">Tie Break</td>'+
            '<td class="classifica-icon">Punti dai match risolti</td><td class="classifica-icon" >Penalità</td>' +
            //'<td class="classifica-icon">Punti dai match in corso</td>' +
            '<td class="classifica-col1SEP"></td>'; 
    for (var i in classificaTeams)         
        stRiga += '<td  class="classifica-icon">  <img class="classifica-avatar" src="' + teams[classificaTeams[i]].icon + '">';
    stRiga += '</tr>'
    $("#classifica").append(stRiga);
    //Riga team
    for (var i in classificaTeams)         
    {
        gruppo = classificaTeams[i];
        stRiga = '<tr class="classifica-risultati">' +
            '<td class="classifica-risultati">' + teams[gruppo].posizione + '</td>' +
            '<td class="classifica-risultati" style="border: 0px;"> <a style="color:black;text-decoration: none;font-weight: normal;" href="' + teams[classificaTeams[i]].url + '" target=”_blank”> ' + teams[classificaTeams[i]].name + '</a></td>' +
            '<td class="classifica-risultati" style="border: 0px;"> <img class="classifica-avatar" src="' + teams[classificaTeams[i]].icon + '"></td>' +
            '<td class="classifica-risultati">' + teams[gruppo].puntiConclusi + '</td>' + 
            //'<td class="classifica-risultati">' + teams[gruppo].puntiSpareggio + '</td>' +
            '<td class="classifica-risultati">' + teams[gruppo].puntiMatchRisolti + '</td>' +
            '<td class="classifica-risultati">' + (teams[gruppo].penalità*-1) + '</td>' +
            //'<td class="classifica-risultati">' + teams[gruppo].puntiInCorso + '</td>' +  
            '<td class="classifica-col1SEP" style="border: 0px;"></td>'; 
        for (var ii in classificaTeams)         
        {
            gruppoAvversario  = classificaTeams[ii];
            stile = '';
            stileTD = '';
            risultato = '';
            partitaConclusa = false;
            if  (gruppo == gruppoAvversario)
            {
                url = '';
                stile = 'background-color:#b3b3b3;';
            } else {
                //Ricerco partita
                boards = 0;
                url = '';
                for (var partita in matchs)         
                {
                    //team da stampare sulla riga è team1
                    if (matchs[partita].team1 == gruppo && matchs[partita].team2 == gruppoAvversario)
                    {
                        url = matchs[partita].url;
                        boards = matchs[partita].boards;
                        score1 = matchs[partita].score1;
                        score2 = matchs[partita].score2;
                        partitaConclusa = matchs[partita].concluso;
                    } 
                    //team da stampare sulla riga è team2
                    if (matchs[partita].team2 == gruppo && matchs[partita].team1 == gruppoAvversario)
                    {
                        url = matchs[partita].url;
                        boards = matchs[partita].boards;
                        score1 = matchs[partita].score2;
                        score2 = matchs[partita].score1;
                        partitaConclusa = matchs[partita].concluso;
                    }
                }

                //Se la partita esiste
                if (boards > 0)
                {
                    //Se terminata
                    if (partitaConclusa)
                    {
                        //Pareggio
                        if (score1 == score2)
                        {
                            risultato = '0.5 - 0.5 <BR> (' + score1 + ' - ' + score2 + ')';
                            stileTD = 'style="background-color:#84b2ed;border: 1px solid black;"';   //PAREGGIO
                            stile = 'color:black;font-weight: bold;';
                        } 
                        //Vinto team 1
                        if (score1 > score2)
                        {
                            risultato = '1 - 0 <BR> (' + score1 + ' - ' + score2 + ')';
                            stileTD = 'style="background-color:#4bc74b;border: 1px solid black;"'; //VINTO
                            stile = 'color:black;font-weight: bold;';
                        } 
                        //Vinto team 2
                        if (score1 < score2)
                        {
                            risultato = '0 - 1 <BR> (' + score1 + ' - ' + score2 + ')';
                            stileTD = 'style="background-color:#f75959;border: 1px solid black;"';  //PERSO
                            stile = 'color:black;font-weight: bold;';
                        } 
                    } else {
                        //Match da terminare
                        risultato = score1 + ' - ' + score2 + '<BR> ('+ (score1+score2) + '/' + (boards*2) + ')';
                        //Pareggio
                        if (score1 == score2)
                            stile = 'color:blue;';
                        //Vinto team 1
                        if (score1 > score2)
                            stile = 'color:green;';
                        //Vinto team 2
                        if (score1 < score2)
                            stile = 'color:red;';
                        stileTD = 'style="border: 1px solid black;"';  //PERSO
                    }
                }
            }
                    

            //Scrivo valori calcolati nella cella
            if (url == '')   //stessa squadra
                stRiga += '<td class="classifica-risultati" style="' + stile + '"> </td>'
            else
               stRiga += '<td ' + stileTD + '> <a style="text-decoration: none;font-weight: normal;' + stile + ' " href="' + url +'" target=”_blank”>' + risultato + '</a></td>';
        }
        stRiga += '</tr>'
        $("#classifica").append(stRiga);
    }




    //Ricerco elo e stampo classifica giocatori
    getAvatar();
}

*/    