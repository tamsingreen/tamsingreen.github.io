var Bowling = {
    players: [],
    scores: [],
    bonus: [],
    totalScore: [],
    frame: 0,
    player: 0,
    ball: 0,

    init: function () {
        Bowling.scores[0] = [];
        Bowling.scores[0][0] = [];
        Bowling.scores[0][0][0] = [];
        $('#scoreboard').hide();
        $('#error-message').hide();
        $('#winner-message').hide();
        $('input:eq(0)').focus();

        //set event handler for Let's play button
        $('#start-play').on('click', function () {
            Bowling.setupGame();
        });

        //Allows enter to be pressed to trigger add-player when button is visible
        $("#player-input").keyup(function (event){
            if (event.keyCode === 13) {
                $("#start-play").click();
            }
        });

        $('#enter-score').on('click', function () {
            Bowling.logScore();
        });

        //Allows enter to be pressed to trigger enter-score when button is visible
        $("tbody").on('keyup', ' input', function (event){
            if (event.keyCode === 13) {
                $("#enter-score").click();
            }
        });
    },

    setupGame: function () {
        Bowling.addPlayers();
        if (Bowling.players.length > 0) {     
            $('#player-input').hide();
            Bowling.buildScoreboard();
            Bowling.updateScoreboard(true);
        }
    },

    addPlayers: function () {
        var playerName = "";
        for (var i = 0; i < 6; i++) {
            playerName = $('input:eq(' + i + ')').val();
            if (playerName !== '' && playerName !== undefined) {
                Bowling.players.push(playerName);
                Bowling.totalScore[[Bowling.players.length - 1]] = 0;
                Bowling.bonus[[Bowling.players.length - 1]] = [0];
            }
        }
        if (Bowling.players.length === 0) {
            //set error message
            $('#input-error').text('Please enter at least one player');
        }
    },

    buildScoreboard: function () {
        for (var i = 0; i < Bowling.players.length; i++) {
            $("#table-header-player").append("<th colspan='4'>" + Bowling.players[i] + "</th>");
            $("#table-header-scores").append("<th>Ball 1</th><th colspan='2'>Ball 2</th><th>Bonus</th>");
        }
        for (var j = 0; j < 10; j++) {
            var tr = "<tr><td>" + (j + 1) + "</td>";
            for (var k = 0; k < Bowling.players.length; k++) {
                if (j === 9) {
                    tr += "<td></td><td></td><td></td><td></td>";
                } else {
                    tr += "<td></td><td colspan='2'></td><td></td>";
                }
            }
            tr += "</tr>";
            $("tbody").append(tr);
        }
        var scoreRow = "<tr><td>Score</td>";
        for (var l = 0; l < Bowling.players.length; l++) {
            scoreRow += "<td colspan='4'></td>";
        }
        scoreRow += "</tr";
        $("tbody").append(scoreRow);
        $('#scoreboard').show();
    },

    updateScoreboard: function (createInput) {
        if (createInput) {
            if (Bowling.frame < 9) {
                $('tr:eq(' + (Bowling.frame + 2) + ') td:eq(' + ((Bowling.player * 3) + Bowling.ball + 1 ) + ')').html('<input type="text" id="score-input"></input>');
            } else {
                $('tr:eq(' + (Bowling.frame + 2) + ') td:eq(' + ((Bowling.player * 4) + Bowling.ball + 1 ) + ')').html('<input type="text" id="score-input"></input>');
            }
            $('#score-input').focus();
        } else {
            if (Bowling.frame < 9) {
                $('tr:eq(' + (Bowling.frame + 2) + ') td:eq(' + ((Bowling.player * 3) + Bowling.ball + 1 ) + ')').text(Bowling.scores[Bowling.frame][Bowling.player][Bowling.ball]);
            } else {
                $('tr:eq(' + (Bowling.frame + 2) + ') td:eq(' + ((Bowling.player * 4) + Bowling.ball + 1 ) + ')').text(Bowling.scores[Bowling.frame][Bowling.player][Bowling.ball]);
            }
            //update total score for player
            $('tr:eq(12) td:eq(' + (Bowling.player + 1) + ')').text(Bowling.totalScore[Bowling.player]);
        }
    },

    updateBonus: function() {
        if (Bowling.frame > 0) {
            $('tr:eq(' + (Bowling.frame + 1) + ') td:eq(' + ((Bowling.player * 3) + 3 ) + ')').text(Bowling.bonus[Bowling.player][Bowling.frame - 1]);
            if (Bowling.frame > 1) {
                $('tr:eq(' + (Bowling.frame) + ') td:eq(' + ((Bowling.player * 3) + 3 ) + ')').text(Bowling.bonus[Bowling.player][Bowling.frame - 2]);
            }
        }
    },

    logScore: function () {
        var score = $('#score-input').val();
        var validateScore = Bowling.validateScore(score);
        if (validateScore.score > -1) {
            $('#error-message').hide();
            Bowling.scores[Bowling.frame][Bowling.player][Bowling.ball] = validateScore.score;
            Bowling.totalScore[Bowling.player] += validateScore.score;
            if (validateScore.score === 10 || Bowling.ball === 1) {
                Bowling.checkForBonus();
                Bowling.updateBonus();
            }
            Bowling.incrementNextTurn();
        } else {
            $('#error-message').text(validateScore.error);
            $('#error-message').show();
        }
    },

    validateScore: function (score) {
        //convert score to int
        var intScore = parseInt(score, 10);
        //only accept score 0-10, no other characters
        if (intScore !== NaN) {
            if (Bowling.ball === 0 || Bowling.frame === 9) {
                if (intScore >= 0 && intScore <= 10) {
                    return {'score': intScore};
                } else {
                    return {'score': -1, 'error' : 'Please enter a number between 0 - 10'};
                }
            } else {
                //ball 0 + ball 1 must be <= 10
                if ((Bowling.scores[Bowling.frame][Bowling.player][0] + intScore) <= 10) {
                    return {'score': intScore};
                } else {
                    return {'score': -1, 'error' : 'Please enter a number between 0 - ' + (10 - Bowling.scores[Bowling.frame][Bowling.player][0])};
                }
            }   
        } else {
            return {'score': -1, 'error' : 'Please enter a number between 0 - 10'};
        }
    },

    checkForBonus: function () {
        var bonusf2 = 0 //bonus to apply to frame - 2
        var bonusf1 = 0; //bonus to apply to frame - 1
        if (Bowling.frame > 0) {
            if (Bowling.frame < 9) {
                //check if frame - 1 was a strike
                if (Bowling.scores[Bowling.frame - 1][Bowling.player][0] === 10) {
                    bonusf1 += Bowling.scores[Bowling.frame][Bowling.player][0];
                    if (Bowling.frame > 1) {
                        //check if frame - 2 was also a strike
                        if (Bowling.scores[Bowling.frame - 2][Bowling.player][0] === 10) {
                            bonusf2 += Bowling.scores[Bowling.frame][Bowling.player][0];
                            Bowling.bonus[Bowling.player][Bowling.frame - 2] += bonusf2;
                            Bowling.totalScore[Bowling.player] += bonusf2;
                        }
                    } 
                    //ball 0 was less than 10, add ball 1
                    if (Bowling.scores[Bowling.frame][Bowling.player][0] != 10) {
                        bonusf1 += Bowling.scores[Bowling.frame][Bowling.player][1];
                    }
                } else {
                    //check if frame - 1 was a spare
                    if ((Bowling.scores[Bowling.frame - 1][Bowling.player][0] + Bowling.scores[Bowling.frame - 1][Bowling.player][1]) === 10) {
                        bonusf1 += Bowling.scores[Bowling.frame][Bowling.player][0];
                    }
                }
                Bowling.bonus[Bowling.player][Bowling.frame - 1] += bonusf1;
                Bowling.totalScore[Bowling.player] += bonusf1;
            } else {
                //handle bonuses in final frame
                switch (Bowling.ball) {
                    case 0: {
                        if ((Bowling.scores[8][Bowling.player][0] === 10) || (Bowling.scores[8][Bowling.player][0] + Bowling.scores[8][Bowling.player][1] === 10)) {
                            bonusf1 += Bowling.scores[9][Bowling.player][0];
                            Bowling.bonus[Bowling.player][Bowling.frame - 1] += bonusf1;
                            Bowling.totalScore[Bowling.player] += bonusf1;
                        }
                        if ((Bowling.scores[8][Bowling.player][0] === 10) && (Bowling.scores[7][Bowling.player][0] === 10)) {
                            bonusf2 += Bowling.scores[9][Bowling.player][0];
                            Bowling.bonus[Bowling.player][Bowling.frame - 2] += bonusf2;
                            Bowling.totalScore[Bowling.player] += bonusf2;
                        }
                        break;
                    }
                    case 1: {
                        if (Bowling.scores[8][Bowling.player][0] === 10) {
                            bonusf1 += Bowling.scores[9][Bowling.player][1];
                            Bowling.bonus[Bowling.player][Bowling.frame - 1] += bonusf1;
                            Bowling.totalScore[Bowling.player] += bonusf1;
                        }
                        break;
                    }
                }
            }
            
        }
    },

    incrementNextTurn: function () {
        Bowling.updateScoreboard(false);
        if (Bowling.frame < 9) {
            //if second ball bowled or a strike, set ball to 0
            if (Bowling.ball === 1 || Bowling.scores[Bowling.frame][Bowling.player][Bowling.ball] === 10) {
                Bowling.ball = 0;
                //if there are more players to play in this frame, go to next player
                if (Bowling.player < Bowling.players.length - 1) {
                    Bowling.player++;
                    Bowling.scores[Bowling.frame][Bowling.player] = [];
                    Bowling.bonus[Bowling.player][Bowling.frame] = 0;
                } else { //if no more players left in this frame, go to next frame
                    Bowling.player = 0;
                    Bowling.frame++;
                    Bowling.scores[Bowling.frame] = [];
                    Bowling.scores[Bowling.frame][0] = [];
                    Bowling.bonus[Bowling.player][Bowling.frame] = 0;
                    
                }
            } else { //otherwise play next ball
                Bowling.ball++;
            }
            Bowling.updateScoreboard(true); 
        } else { //handle increment in final frame
            switch (Bowling.ball) {
                case 0: { //always play second ball
                    Bowling.ball++;
                    Bowling.updateScoreboard(true); 
                    break;
                }
                //if a spare is bwoled or ball 2 is a strike, play another ball
                case 1: {
                    if (((Bowling.scores[Bowling.frame][Bowling.player][0] + Bowling.scores[Bowling.frame][Bowling.player][1]) === 10) || Bowling.scores[Bowling.frame][Bowling.player][1] === 10) {
                        Bowling.ball++;
                        Bowling.updateScoreboard(true); 
                    } else if (Bowling.player < Bowling.players.length - 1) {
                        //if there are more players to play, go to next player
                        Bowling.ball = 0;
                        Bowling.player++;
                        Bowling.scores[Bowling.frame][Bowling.player] = [];
                        Bowling.bonus[Bowling.player][Bowling.frame] = 0;
                        Bowling.updateScoreboard(true);
                    } else { //if no more players, end game
                        Bowling.declareWinner();
                    }
                    break;
                }
                case 2: {
                    //if ball 2 player and there are more players to play, go to next player
                    if (Bowling.player < Bowling.players.length - 1) {
                        Bowling.ball = 0;
                        Bowling.player++;
                        Bowling.scores[Bowling.frame][Bowling.player] = [];
                        Bowling.bonus[Bowling.player][Bowling.frame] = 0;
                        Bowling.updateScoreboard(true);
                    } else { //if no more players, end game
                        Bowling.declareWinner();
                    }
                    break;
                }
            }
        }
    },

    declareWinner: function() {
        var winner = Bowling.totalScore.indexOf(Math.max.apply(null, Bowling.totalScore))
        $('#winner-name').text(Bowling.players[winner]);
        $('#winner-message').show();
        $('#enter-score').hide();
    }
} //end of bowling.js

