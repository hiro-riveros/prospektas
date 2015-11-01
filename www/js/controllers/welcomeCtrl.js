(function (){
  this.app.controller('welcomeCtrl', ['$scope', '$state', '$stateParams' ,
  function($scope, $state, $stateParams){

    var drawingManager;
    var selectedShape;
    var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
    var selectedColor;
    var colorButtons = {};
    var arraySecond = {};
    var coord = {};
    var fullArray={};


    function clearSelection () {
      if (selectedShape) {
        if (selectedShape.type !== 'marker') {
          selectedShape.setEditable(false);
        }

        selectedShape = null;
      }
    }

    function setSelection (shape) {
      if (shape.type !== 'marker') {
        clearSelection();
        shape.setEditable(true);
        selectColor(shape.get('fillColor') || shape.get('strokeColor'));
      }

      selectedShape = shape;
    }

    function deleteSelectedShape () {
      if (selectedShape) {
        selectedShape.setMap(null);
      }
    }

    function selectColor (color) {
      selectedColor = color;
      for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i];
        colorButtons[currColor].style.border = currColor == color ? '2px solid #789' : '2px solid #fff';
      }

      // Retrieves the current options from the drawing manager and replaces the
      // stroke or fill color as appropriate.
      var polylineOptions = drawingManager.get('polylineOptions');
      polylineOptions.strokeColor = color;
      drawingManager.set('polylineOptions', polylineOptions);

      var rectangleOptions = drawingManager.get('rectangleOptions');
      rectangleOptions.fillColor = color;
      drawingManager.set('rectangleOptions', rectangleOptions);

      var circleOptions = drawingManager.get('circleOptions');
      circleOptions.fillColor = color;
      drawingManager.set('circleOptions', circleOptions);

      var polygonOptions = drawingManager.get('polygonOptions');
      polygonOptions.fillColor = color;
      drawingManager.set('polygonOptions', polygonOptions);
    }

    function setSelectedShapeColor (color) {
      if (selectedShape) {
        if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
          selectedShape.set('strokeColor', color);
        } else {
          selectedShape.set('fillColor', color);
        }
      }
    }

    function makeColorButton (color) {
      var button = document.createElement('span');
      button.className = 'color-button';
      button.style.backgroundColor = color;
      google.maps.event.addDomListener(button, 'click', function () {
        selectColor(color);
        setSelectedShapeColor(color);
      });

      return button;
    }

    function buildColorPalette () {
      var colorPalette = document.getElementById('color-palette');
      for (var i = 0; i < colors.length; ++i) {
        var currColor = colors[i];
        var colorButton = makeColorButton(currColor);
        colorPalette.appendChild(colorButton);
        colorButtons[currColor] = colorButton;
      }
      selectColor(colors[0]);
    }

    function initialize () {
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: new google.maps.LatLng(52.25097, 20.97114),
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true,
        zoomControl: true
      });

      var polyOptions = {
        strokeWeight: 0,
        fillOpacity: 0.45,
        editable: true,
        draggable: true
      };
      // Creates a drawing manager attached to the map that allows the user to draw
      // markers, lines, and shapes.
      drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        markerOptions: {
          draggable: true
        },
        polylineOptions: {
          editable: true,
          draggable: true
        },
        rectangleOptions: polyOptions,
        circleOptions: polyOptions,
        polygonOptions: polyOptions,
        map: map
      });

      google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
    var fullArray={};
        //document.getElementById("asdf").val(e.overlay.getPath().getArray());
        $('#inputAux').val(e.overlay.getPath().getArray());
        var arrayFirst = document.getElementById("inputAux").value;
        var arraySecond = arrayFirst.split('),');





        for (var i = 0; i < arraySecond.length; i++) {
          var coord = arraySecond[i].split(',');
          var obj = new Object();
          obj.lat = coord[0].replace('(', '');
          obj.long = coord[1].replace(')', '');
          var jsonString= JSON.stringify(obj);
          fullArray[i]= jsonString;
        }

          $('#modal3').openModal();

        debugger
        $scope.coordenadas =fullArray;


        //alert(x);

        $('#mapa').addClass('hide')
        $('#formulario').removeClass('hide');


        var newShape = e.overlay;

        newShape.type = e.type;

        if (e.type !== google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          drawingManager.setDrawingMode(null);

          // Add an event listener that selects the newly-drawn shape when the user
          // mouses down on it.
          google.maps.event.addListener(newShape, 'click', function (e) {
            if (e.vertex !== undefined) {
              if (newShape.type === google.maps.drawing.OverlayType.POLYGON) {
                var path = newShape.getPaths().getAt(e.path);
                path.removeAt(e.vertex);
                if (path.length < 3) {
                  newShape.setMap(null);
                }
              }
              if (newShape.type === google.maps.drawing.OverlayType.POLYLINE) {
                var path = newShape.getPath();
                path.removeAt(e.vertex);
                if (path.length < 2) {
                  newShape.setMap(null);
                }
              }
            }
            setSelection(newShape);
          });
          setSelection(newShape);
        }
        else {
          google.maps.event.addListener(newShape, 'click', function (e) {
            setSelection(newShape);
          });
          setSelection(newShape);
        }
      });

      // Clear the current selection when the drawing mode is changed, or when the
      // map is clicked.
      google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
      google.maps.event.addListener(map, 'click', clearSelection);
      google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);

      buildColorPalette();
    }
    google.maps.event.addDomListener(window, 'load', initialize);



  }]);

}).call(this);
