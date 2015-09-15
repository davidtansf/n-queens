/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// Hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space.)
// Take a look at solversSpec.js to see what the tests are expecting

window.findSolution = function(board, currRow, n, conflictsChecker, validBoardCallback) {
  var keepGoing;

  if( currRow === n ) {
    keepGoing = validBoardCallback(board);
    return keepGoing;
  }

  for( var i = 0; i < n; i++ ) {
    board.setPiece(currRow, i, 1);
    if( !conflictsChecker() ) {
      keepGoing = findSolution(board, currRow+1, n, conflictsChecker, validBoardCallback);
      if( !keepGoing ) {
        return false; 
      }
    }
    board.setPiece(currRow, i, 0);
  }

  return true;    // keep going
};

// Return a matrix (an array of arrays) representing a single nxn chessboard,
// with n rooks placed such that none of them can attack each other.
window.findNRooksSolution = function(n) {
  var solution = undefined;
  var board = new Board({n:n});

  findSolution(board, 0, n, board.hasAnyRooksConflicts.bind(board), function(board) {
    // Copy the board and tell caller to stop recursing/processing
    solution = board.allRows();
    return false;
  });

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};


// Return the number of nxn chessboards that exist, with n rooks placed such that none
// of them can attack each other.
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n:n});

  findSolution(board, 0, n, board.hasAnyRooksConflicts.bind(board), function(board) {
    // Count the solution and tell the caller to keep checking for more
    solutionCount++;
    return true;
  });

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};


// Return a matrix (an array of arrays) representing a single nxn chessboard,
// with n queens placed such that none of them can attack each other.
window.findNQueensSolution = function(n) {
  var board = new Board({n:n});
  var solution = board.allRows();
  //solution = undefined;
  // If no solution exists, function will return the original empty board

  findSolution(board, 0, n, board.hasAnyQueensConflicts.bind(board), function(board) {
    // Copy the board and tell caller to stop recursing/processing
    solution = board.allRows();
    return false;
  });

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// Return the number of nxn chessboards that exist, with n queens placed such that none
// of them can attack each other.
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n:n});

  findSolution(board, 0, n, board.hasAnyQueensConflicts.bind(board), function(board) {
    // Count the solution and tell the caller to keep checking for more
    solutionCount++;
    return true;
  });

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
