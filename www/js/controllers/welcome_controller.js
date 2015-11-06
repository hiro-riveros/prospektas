(function (){
	this.app.controller('welcomeController', ['$scope', '$log', '$state', '$stateParams' , '$ionicPopup', '$cordovaCamera','$cordovaImagePicker',
		function($scope, $log, $state, $stateParams, $ionicPopup, $cordovaCamera, $cordovaImagePicker){
		// debugger;
		var drawingManager;
		var selectedShape;
		var colors = ['#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4B0082'];
		var selectedColor;
		var colorButtons = {};
		var arraySecond = {};
		var coord = {};
		var fullArray={};
		var confirmPopup ;
		var a=0;



		var clearSelection = function () {

			if (selectedShape) {

				if (selectedShape.type !== 'marker') {
					selectedShape.setEditable(false);
				};
				selectedShape = null;
			};
		};

		var setSelection = function (shape) {

			if (shape.type !== 'marker') {
				clearSelection();
				shape.setEditable(true);
				selectColor(shape.get('fillColor') || shape.get('strokeColor'));
			};
			selectedShape = shape;
		};

		var deleteSelectedShape = function() {
			if (selectedShape) {
				selectedShape.setMap(null);
			};
		};

		var selectColor = function(color) {
			selectedColor = color;
			for (var i = 0; i < colors.length; ++i) {
				var currColor = colors[i];
				colorButtons[currColor].style.border = currColor == color ? '2px solid #fff' : '2px solid #fff ';
				colorButtons[currColor].style.height = '50px';
				colorButtons[currColor].style.width = '50px';
				colorButtons[currColor].style.borderRadius = '25px';
			};

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
		};

		var setSelectedShapeColor = function(color) {
			switch (color) {
				case '#1E90FF':
			Materialize.toast('color Azul', 3000, 'rounded');
			break;
				case '#FF1493':
			Materialize.toast('color Rosado', 3000, 'rounded');
			break;
				case '#32CD32':
			Materialize.toast('color Verde', 3000, 'rounded');
			break;
				case '#FF8C00':
			Materialize.toast('color Naranjo', 3000, 'rounded');
			break;
				case '#4B0082':
			Materialize.toast('color Morado', 3000, 'rounded');
			break;

					break;
				default:

			}

			if (selectedShape) {

				if (selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
					selectedShape.set('strokeColor', color);

				} else {
					selectedShape.set('fillColor', color);
				};
			};
		};

		var makeColorButton = function(color) {
			var button = document.createElement('div');
			button.className = 'collection';
			button.style.backgroundColor = color;
			google.maps.event.addDomListener(button, 'click', function () {
				selectColor(color);
				setSelectedShapeColor(color);
			});
			return button;
		};

		var buildColorPalette = function() {
			var colorPalette = document.getElementById('color-palette');
			colorPalette.className = 'collection-item';

			for (var i = 0; i < colors.length; ++i) {
				var currColor = colors[i];
				var colorButton = makeColorButton(currColor);
				colorPalette.appendChild(colorButton);
				colorButtons[currColor] = colorButton;
			};
			selectColor(colors[0]);
		};

		var initialize = function() {
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
				var data = [];
				var inputAux = document.getElementById("input-aux");
				inputAux.value = e.overlay.getPath().getArray();
				var shapeValues = inputAux.value.split('),');
				for (var i = 0; i < shapeValues.length; i++) {
					var coord = shapeValues[i].split(',');
					var object = new Object();
					object.lat = coord[0].replace('(', '');
					object.long = coord[1].replace(')', '');
					data.push(object);
				};
				$scope.coords = data;




					var confirmPopup = $ionicPopup.confirm({
						title: 'Prospektas',
						template: 'Confirmacion de coordenadas escogidas.</br>	<div class="progress"><div class="indeterminate"></div></div>'
					});
				 confirmPopup.then(function(response) {
						if(response) {

								selectedShape = null;
								document.getElementById('map-container').classList.add('hide');
								document.getElementById('form').classList.remove('hide');
								document.getElementById('menu').classList.add('hide');
								document.getElementById('back').classList.remove('hide');
								document.getElementById('welcome_title').innerHTML = "Formulario <i class='icon ion-clipboard'></i> ";
								document.getElementById('magic-bubble').classList.remove('hide')


						} else {
							initialize();


						};
				 });





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
								};
							};
							if (newShape.type === google.maps.drawing.OverlayType.POLYLINE) {
								var path = newShape.getPath();
								path.removeAt(e.vertex);
								if (path.length < 2) {
									newShape.setMap(null);
								};
							};
						};
						setSelection(newShape);
					});
					setSelection(newShape);
				}	else {
					google.maps.event.addListener(newShape, 'click', function (e) {
						setSelection(newShape);
					});
					setSelection(newShape);
				};
			});

			// Clear the current selection when the drawing mode is changed, or when the
			// map is clicked.
			google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
			google.maps.event.addListener(map, 'click', clearSelection);
			google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);
			buildColorPalette();
		};
		// google.maps.event.addDomListener(window, 'load', initialize);

		initialize();
		// if(a==0){
		// 	showAlert();
		// 		a++
		// }








		$scope.takePicture = function() {
			var options = {
	      quality: 50,
	      destinationType: Camera.DestinationType.DATA_URL,
	      sourceType: Camera.PictureSourceType.CAMERA,
	      allowEdit: true,
	      encodingType: Camera.EncodingType.JPEG,
	      targetWidth: 100,
	      targetHeight: 100,
	      // popoverOptions: CameraPopoverOptions,
	      saveToPhotoAlbum: false,
	      correctOrientation:true
    	};

    	$cordovaCamera.getPicture(options).then(function(imageData) {
      	var image = {};
      	image.src = "data:image/jpeg;base64," + imageData;
      	$ionicPopup.alert({
      		title: 'estatus de la fotografia',
      		template: 'la fotografia a sido tomada con exito!'
      	});
      	$log.info(image.src);
		  }, function(err) {
		    $ionicPopup.alert({
      		title: 'estatus de la fotografia',
      		template: 'la fotografia no a sido tomada con exito!'
      	});
		  });

		};


		$scope.back=function () {
			document.getElementById('map-container').classList.remove('hide');
			document.getElementById('form').classList.add('hide');
			document.getElementById('menu').classList.remove('hide');
			document.getElementById('back').classList.add('hide');
			 document.getElementById('magic-bubble').classList.add('hide') ;
			// 	constructor() {
			//
			// 	}
			// }
			initialize();


		}




		$('.floating-button').leanModal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      in_duration: 700, // Transition in duration
      out_duration: 300, // Transition out duration
      ready: function() { console.info('Ready'); }, // Callback for Modal open
      complete: function() { console.info('Closed'); } // Callback for Modal close
    });

		$('.dropdown-button').dropdown({
	      inDuration: 300,
	      outDuration: 225,
	      constrain_width: false, // Does not change width of dropdown to that of the activator
	      hover: true, // Activate on hover
	      gutter: 0, // Spacing from edge
	      belowOrigin: false, // Displays dropdown below the button
	      alignment: 'left' // Displays dropdown with edge aligned to the left of button
	    }
	  );


		$scope.showAlert = function() {
	 var alertPopup = $ionicPopup.alert({
		 title: 'Don\'t eat that!',
		 template: 'It might taste good'
	 });
	 alertPopup.then(function(res) {
		 console.log('Thank you for not eating my delicious ice cream cone');
	 });
	};

	$scope.pickAPicture = function() {

		var options = {
   maximumImagesCount: 10,
   width: 800,
   height: 800,
   quality: 80
  };

  $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
      }
    }, function(error) {
      // error getting photos
    });


	};



	}]);

}).call(this);
