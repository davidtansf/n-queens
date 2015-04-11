// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) { // test for two pieces on the same row

      var row = this.get(rowIndex);
      var count = 0;

      for (var i = 0; i < row.length; i++) {
        count += row[i];
      }
      return count > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {

      var n = this.get('n');

      for (var i = 0; i < n; i++) { // n is number of rows
        if (this.hasRowConflictAt(i)) { // callback function
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict

    hasColConflictAt: function(colIndex) {
      // var board1 = this.rows();
      // var temp = _.zip(board1);
      // var transpose = [];
      // var count = 0;

      // for (var i = 0; i < temp.length; i++) {
      //   transpose.push(temp[i][0]); // gets rid of unnecessary nested array
      // }

      // var column = transpose[colIndex];

      // for (var j = 0; j < column.length; j++) {
      //   if (column[j] === 1) {
      //     count ++;
      //  }
      // }
      // return count > 1;

      var n = this.get('n');
      var counter = 0;

      for (var i = 0; i < n; i++) {
        var temprow = this.get(i);
        if (temprow[colIndex] === 1) {
          counter ++;
        }
      }
      return counter > 1;

    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {

      var n = this.get('n');

      for (var k = 0; k < n; k++) { // n is number of rows
        if (this.hasColConflictAt(k)) { // callback function
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var queenArray = [];
      var n = this.get('n');

      //Loading Queen Array's locations for [x,y]
      for (var i = 0; i < n; i++){     //i is the row index
        for (var j = 0; j < n; j++){   //j is the column index

          var tempRow = this.get(i);
          if (tempRow[j] === 1) {
           queenArray.push([i,j]);
          }
        }
      }

      if (queenArray.length < 2) {
        return false;

      } else {
        for (var k = 0; k < queenArray.length - 1; k++) {
          for (var m = 1; m < queenArray.length - k; m++) {
            var deltarow = queenArray[k][0] - queenArray[m][0];
            var deltacolumn = queenArray[k][1] - queenArray[m][1];
            if (deltacolumn / deltarow === 1) {
              return true;
            }
          }
        }
      }

      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {

      return this.hasMajorDiagonalConflictAt();

    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var queenArray = [];
      var n = this.get('n');

      //Loading Queen Array's locations for [x,y]
      for (var i = 0; i < n; i++){     //i is the row index
        for (var j = 0; j < n; j++){   //j is the column index

          var tempRow = this.get(i);
          if (tempRow[j] === 1) {
           queenArray.push([i,j]);
          }
        }
      }

      if (queenArray.length < 2) {
        return false;

      } else {
        for (var k = 0; k < queenArray.length - 1; k++) {
          for (var m = 1; m < queenArray.length - k; m++) {
            var deltarow = queenArray[k][0] - queenArray[m][0];
            var deltacolumn = queenArray[k][1] - queenArray[m][1];
            if (deltacolumn / deltarow === -1) {
              return true;
            }
          }
        }
      }

      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {

      return this.hasMinorDiagonalConflictAt();

    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

/*
var Make = function (n) {
  var myArray = [];
  for (var i = 0; i < n; i++) {
    myArray[i] = -1;
  }
  return myArray;
};

function checkforfullBoard(array) {
  var count = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] > -1 && array[i] < array.length) {
      count++;
    }
  }
  return count > array.length - 1;
}

function noConflicts (array) {
  var tally = {};

  for (var i = 0; i < array.length ; i++) {
    (!tally[array[i]]) ? (tally[array[i]] = 1) : tally[array[i]]++;
  }
  delete tally[-1];

  for (var key in tally) {
    if (tally[key] > 1) {
      return false;
    }
  }
  return true;
}

function viableSolution (array) {
  return noConflicts(array) && checkforfullBoard(array);
}

function CountNRookSolutions(n) {
  var solutionCount = 0;
  var board = new Make(n);

  var recursive = function() {
    if (viableSolution(board)) {
      solutionCount++;
    }

    for (var i = 0; i < n; i++) {

    }
  }
  recursive();
}

console.log(CountNRookSolutions(3));
*/
