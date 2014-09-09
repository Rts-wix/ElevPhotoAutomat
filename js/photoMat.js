	navigator.getUserMedia = 
	(
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia
	);
	
	function captureImage(video, canvas)
	{
		//var canvas = new Canvas();
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		
		// draw vidoeframe onto tha canvas
		canvas.getContext('2d').drawImage(video,0,0);
		var imgData = canvas.toDataURL("img/png");
		var image = document.getElementById("imgPreview");
		image.src = imgData;
	}
		
	function updatePreview(c) {
		if(parseInt(c.w) > 0) {
			// Show image preview
			var imageObj = $("#myCanvas")[0];
			var canvas = $("#canvasPreview")[0];
			
			canvas.width = 343;
			canvas.height = 453;

			var context = canvas.getContext("2d");
			context.drawImage(imageObj, 
								parseInt(c.x)*2, Math.abs( parseInt(c.y))*2, 
								parseInt(c.w)*2, parseInt(c.h)*2, 
								0, 0, canvas.width, canvas.height);
		}
	};
	

	function captureClickHandler(e)
	{
		var video = document.getElementById('myVideo');
		
		// get canvas element
		var canvas = document.getElementById("myCanvas");
		
		captureImage(video, canvas);
		
		// Jcrop hack??
		$(".jcrop-holder img").attr("src", $('#imgPreview').attr("src"));
		$('#imgPreview').Jcrop({
			onChange : updatePreview,
			onSelect : updatePreview,
			aspectRatio : 343/453,
			setSelect : [69, 1, 151, 240]
		});
	}
	
	function gemClickHandler(eventBoss)
	{
		var elevNavn = document.getElementById('navn');
		var cprnr = document.getElementById('cprnr');
		var canvasPreview = document.getElementById('canvasPreview');
		
		var imgData = canvasPreview.toDataURL("image/jpeg");
		// remove extraneous data from start of string
		imgData = imgData.replace('data:image/jpeg;base64,', '');
		
		var elevData = {
			navn: elevNavn.value,
			billede: imgData
		};
		localStorage[cprnr.value] = JSON.stringify(elevData);
		Load();
	}
	
	navigator.getUserMedia( {video: true}, 
		function(stream) {
			// get video element
			var video = document.getElementById('myVideo');
			
			// recieve input from webcam
			video.src = window.URL.createObjectURL(stream);
		},
		function(err) {
			console.log("The following error occured: " + err);
		}
	);

	function Load()
	{
		var elevListe = document.getElementById('elevListe');
		var elevElem = document.getElementById("elevElem");

		elevListe.innerHTML = "";

		for (cprNr in localStorage)
		{
			var elevData = JSON.parse(localStorage[cprNr]);
			if (elevData.billede != null)
			{
				var elevDiv = elevElem.cloneNode(true);
		
				elevDiv.querySelector('img').setAttribute('src', 'data:image/jpeg;base64,' + elevData.billede);
				elevDiv.querySelector('span').innerHTML = elevData.navn;
		
				elevListe.appendChild(elevDiv);
			}
		}
	}
	
	function zipClickHandler(event)
	{
	
		var zip = new JSZip();

		for (cprNr in localStorage)
		{
			var elevData = JSON.parse(localStorage[cprNr]);
			if (elevData.billede != null)
			{
				zip.file(cprNr + ".jpg", elevData.billede, {base64: true});
			}
		}

		var blobLink = document.getElementById('blob');
		try {
			blobLink.download = "Hold_xx.zip";
			blobLink.href = window.URL.createObjectURL(zip.generate({type:"blob"}));
		} catch(e) {
			blobLink.innerHTML += " (not supported on this browser)";
		}
		return false;
	}
