/*
One is a game made for QUILTBAG 2013, based on Perlenspiel.
Copyright (C) 2013
Saxon Douglass <saxon@saxondouglass.com>
Harriet Llord <hattie.lloyd@gmail.com>

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-12 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

// The following comment lines are for JSLint. Don't remove them!
/*jslint nomen: true, white: true */
/*global PS */

// UTILITY METHODS
Number.prototype.clamp = function ( a, b ) {
    return ( Math.min( Math.max( this, a ), b ) )
}

// CONSTANTS
var WIDTH = 8;
var HEIGHT = 8;
var COLOR = {
    COUPLE: PS.MakeRGB( 200, 200, 200 ),
    EMPTY: PS.COLOR_WHITE,
    FEMALE: PS.MakeRGB( 250, 170, 210 ),
    MALE: PS.MakeRGB( 170, 210, 250 ),
    PLAYER: PS.MakeRGB( 170, 250, 210 ),
}
var GRID = {
    WIDTH: 7,
    HEIGHT: 7,
    LENGTH: 8 * 8,
}
var KEY = {
    R: "R".charCodeAt(0),
    UP: PS.ARROW_UP,
    DOWN: PS.ARROW_DOWN,
    LEFT: PS.ARROW_LEFT,
    RIGHT: PS.ARROW_RIGHT,
}
var LEVEL = [
    {
        text: "I found myself in a strange world",
        grid:
"........\
........\
...PF...\
....M...\
....F...\
...FMF..\
........\
........",
    },
    {
        text: "Where same would pair with same",
        grid:
".......\
.F......\
........\
..F....F\
......P.\
........\
M..M.M..\
....F...",
    },
        {
        text: "Although I thought it quite absurd",
        grid:
".F..#...\
.M..#.FM\
....#...\
###.....\
....P###\
...#....\
MF.#..M.\
...#..F.",
    },
        {
        text: "I had to play their game",
        grid:
".P.##...\
.M.##.F.\
...M....\
#.####.#\
#M####M#\
....F...\
.M.##...\
...##..M",
    },
        {
        text: "And from afar I saw the one",
        grid:
"GF......\
F.F.F.F.\
.F.FMF..\
..F.F.F.\
.FMF.F..\
..F.F.F.\
.F.F.F..\
.......P",
    },
    {
        text: "The one was just like me",
        grid:
"....M...\
.#....M.\
...M#.F.\
..#P##..\
..##G#..\
.F.#M...\
.M....#.\
...M....",
    },
    {
        text: "I turned and looked, but they were gone",
        grid:
".....F..\
.##..##.\
....F.#.\
...#..M.\
.F..#...\
.#P....M\
.##M.##.\
........",
    },
    {
        text: "Alone I'm doomed to be",
        grid:
"#.......\
.#....G.\
..#.....\
...#....\
....#...\
.....#..\
.P....#.\
.......#",
    },
]
NOTE = []

// GLOBAL VARS
var level = 0
var levelTimer = 0
var lovePresent = false
var matches = 0
var unmatched = null
var player = {
    x: null,
    y: null,
    
    move: function ( dx, dy ) {
        var width = WIDTH - 1
        var height = HEIGHT - 1
        // Push block
        var ahead = PS.BeadColor(
            (this.x + dx).clamp( 0, width ),
            (this.y + dy).clamp( 0, height )
        );
        var aheadAgain = PS.BeadColor(
            (this.x + ( dx * 2) ).clamp( 0, width ),
            (this.y + ( dy * 2) ).clamp( 0, height )
        );
        if ( ahead === COLOR.FEMALE || ahead === COLOR.MALE ) {
            if ( aheadAgain !== COLOR.EMPTY ) {
                return
            }
            PS.BeadColor( this.x + dx, this.y + dy, COLOR.EMPTY )
            PS.BeadColor( this.x + ( dx * 2 ), this.y + ( dy * 2 ), ahead )
            CheckCouple( this.x + ( dx * 2 ), this.y + ( dy * 2 ) )
        } else if ( ahead === COLOR.COUPLE ) {
            return
        }
        
        // Clear love
        if ( lovePresent ) {
            PS.BeadColor( this.y, this.x, COLOR.EMPTY )
        }
        
        // Move player
        PS.BeadColor( this.x, this.y, COLOR.EMPTY )
        this.x = ( this.x + dx ).clamp( 0, width )
        this.y = ( this.y + dy ).clamp( 0, height )
        PS.BeadColor( this.x, this.y, COLOR.PLAYER )
        
        // Update love
        if ( lovePresent ) {
            PS.BeadColor( this.y, this.x, COLOR.PLAYER )
        }
        
        // Check for level completion
        if ( unmatched == 0 && level + 1 < LEVEL.length) {
            levelTimer = 90
        }
    },
}

// GAME FUNCTIONS
var CheckCouple = function ( x, y ) {
    var self = PS.BeadColor( x, y )
    var match = false
    if ( y - 1 >= 0 && PS.BeadColor( x, y - 1 ) === self ) {
        FormCouple( x, y - 1 )
        match = true
    }
    if ( y + 1 <= HEIGHT - 1 && PS.BeadColor( x, y + 1 ) === self ) {
        FormCouple( x, y + 1 )
        match = true
    }
    if ( x - 1 >= 0 && PS.BeadColor( x - 1, y ) === self ) {
        FormCouple( x - 1, y )
        match = true
    }
    if ( x + 1 <= WIDTH - 1 && PS.BeadColor( x + 1, y ) === self ) {
        FormCouple( x + 1, y )
        match = true
    }
    if ( match ) {
        FormCouple( x, y )
        matches++
        PS.AudioPlay( NOTE[ Math.min( matches, 7 ) ], 0.3 )
    }
}
var FormCouple = function ( x, y ) {
    PS.BeadFlash( x, y, true )
    PS.BeadFlashColor( x, y, PS.BeadColor ( x, y ) )
    PS.BeadColor( x, y, COLOR.COUPLE )
    PS.BeadFlash( x, y, false )
    unmatched--
}
var Index2X = function (i) {
    return i % ( WIDTH )
}
var Index2Y = function (i) {
    return Math.floor( i / WIDTH )
}
var LoadLevel = function ( n ) {
    PS.BeadFlash( PS.ALL, PS.ALL, true )
    PS.BeadFlashColor( PS.ALL, PS.ALL, COLOR.EMPTY )
    var length = WIDTH * HEIGHT
    PS.StatusText(LEVEL[n].text)
    matches = 0
    unmatched = 0
    lovePresent = false
    for (var i = 0; i < length; i++) {
        var x = Index2X(i)
        var y = Index2Y(i)
        switch ( LEVEL[n].grid[i] ) {
        case "#":
            PS.BeadColor( x, y, COLOR.COUPLE )
            break
        case "F":
            PS.BeadColor( x, y, COLOR.FEMALE )
            unmatched++
            break
        case "G":
            PS.BeadColor( x, y, COLOR.PLAYER )
            if ( level === LEVEL.length - 1 ) {
                lovePresent = true
            }
            break
        case "M":
            PS.BeadColor( x, y, COLOR.MALE )
            unmatched++
            break
        case "P":
            player.x = x
            player.y = y
            PS.BeadColor( player.x, player.y, COLOR.PLAYER )
            break
        default:
            PS.BeadColor( x, y, COLOR.EMPTY )
        }
    }
    PS.BeadFlash( PS.ALL, PS.ALL, false )
}
var Restart = function () {
    LoadLevel( level )
}

// Initializes the game
PS.Init = function (options)
{
    "use strict";

    PS.Clock( 1 )
    
    // change to the grid dimensions you want
    PS.GridSize( WIDTH, HEIGHT )
    PS.BeadBorderWidth( PS.ALL, PS.ALL, 0 )
    PS.StatusColor( PS.MakeRGB( 130, 130, 130 ) )
    
    
    PS.AudioPath( "/static/games/one/audio/" )
    NOTE[1] = "l_piano_eb6"
    NOTE[2] = "l_piano_db6"
    NOTE[3] = "l_piano_bb5"
    NOTE[4] = "l_piano_ab5"
    NOTE[5] = "l_piano_gb5"
    NOTE[6] = "l_piano_eb5"
    NOTE[7] = "l_piano_db5"
    for ( var i = 1; i <= 7; i++ ) {
        PS.AudioLoad( NOTE[i] )
    }
    
    // Put any other init code here
    LoadLevel( level )
}

// This function is called whenever a bead is clicked
PS.Click = function (x, y, data, options)
{
    "use strict";
    var dx = x - player.x;
    var dy = y - player.y;

    if ( dx === 0 || dy === 0 ) {
        player.move( dx.clamp( -1, 1), dy.clamp( -1, 1) )
    }
}

// This function is called whenever a mouse button is released over a bead
PS.Release = function (x, y, data, options)
{
    "use strict";

    // Put code here for when the mouse button is released over a bead	
}

// This function is called whenever the mouse moves over a bead
PS.Enter = function (x, y, data, options)
{
    "use strict";

    // Put code here for when the mouse enters a bead
}

// This function is called whenever the mouse moves away from a bead
PS.Leave = function (x, y, data, options)
{
    "use strict";
    
    // Put code here for when the mouse leaves a bead	
}

// This function is called whenever a key on the keyboard is pressed
PS.KeyDown = function (key, shift, ctrl, options)
{
    "use strict";

    switch (key) {
    case KEY.UP:
        player.move( 0, -1 )
        break
    case KEY.DOWN:
        player.move( 0, 1 )
        break
    case KEY.LEFT:
        player.move( -1, 0 )
        break
    case KEY.RIGHT:
        player.move( 1, 0 )
        break
    case KEY.R:
        Restart()
        break
    }
}

// This function is called whenever a key on the keyboard is released
PS.KeyUp = function (key, shift, ctrl, options)
{
    "use strict";
    
    // Put code here for when a key is released	
}

// This function is called whenever the mouse wheel moves forward or backward
PS.Wheel = function (dir, options)
{
    "use strict";

    // Put code here for when mouse wheel is moved
}

// This function is called on every clock tick
// if a timer has been activated with a call to PS.Timer()
PS.Tick = function (options)
{
    "use strict";

    // Put code here to handle clock ticks
    if ( levelTimer > 0 ) {
        levelTimer--
        if ( levelTimer == 0 ) {
            level++
            LoadLevel(level)
        }
    }
}
