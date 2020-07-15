/** To setup user profile */
const profile = {
	userProfile: {
		name: 'Joginder Pawan',
		firstName: 'Joginder',
		lastName: 'Pawan',
		email: 'joginder.pawan@gmail.com',
	}
}
const CLIENT_ID = "a1648e3fdc99492d88bb309c70832c4c";

var fileToRead = document.getElementById("file-picker");
var files = '';
fileToRead.addEventListener("change", function (event) {
	files = fileToRead.files;
	$('#upload-pdf-p').text('PDF uploaded. Please select desired view.').addClass('success-color');
	$('.btn').removeClass('disabled');
});

/** To view PDF in FULL WINDOW view */
$('#full-window-btn').click(function () {
	displayPdfInFullWindowView();
	$('#adobe-dc-full-window').show();
	$('#adobe-dc-full-window').siblings().hide();
});

/** To view PDF in SIZED CONTAINER view */
$('#sized-container-btn').click(function () {
	displayPdfInSizedContainerView();
	$('#adobe-dc-sized-container').show();
	$('#adobe-dc-sized-container').siblings().hide();
});

/** To view PDF in IN LINE view */
$('#in-line-btn').click(function () {
	displayPdfInLineView();
	$('#adobe-dc-in-line').show();
	$('#adobe-dc-in-line').siblings().hide();
});

function displayPdfInSizedContainerView() {
	const viewerConfig = {
		"embedMode": "SIZED_CONTAINER"
	};
	var adobeDCView = new AdobeDC.View({
		clientId: CLIENT_ID,
		divId: "adobe-dc-sized-container",
	});	
	setFileToPreview(adobeDCView, viewerConfig);
	trackPdfEvents(adobeDCView);
};

function displayPdfInLineView() {
	const viewerConfig = {
		"defaultViewMode": "FIT_PAGE",
		"embedMode": "IN_LINE"
	};
	var adobeDCView = new AdobeDC.View({
		clientId: CLIENT_ID,
		divId: "adobe-dc-in-line",
	});	
	setFileToPreview(adobeDCView, viewerConfig);
	trackPdfEvents(adobeDCView);
};

function displayPdfInFullWindowView() {
	const viewerConfig = {
		"defaultViewMode": "FIT_PAGE",
		"embedMode": "FULL_WINDOW",
		"showLeftHandPanel": false
	};
	var adobeDCView = new AdobeDC.View({
		clientId: CLIENT_ID,
		divId: "adobe-dc-full-window",
	});
	
	setFileToPreview(adobeDCView, viewerConfig);
	trackPdfEvents(adobeDCView);
	
	adobeDCView.registerCallback(
		AdobeDC.View.Enum.CallbackType.GET_USER_PROFILE_API,
		function () {
			return new Promise((resolve, reject) => {
				resolve({
					code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
					data: profile
				})
			})
		});
};

function trackPdfEvents(adobeDCView) {
	adobeDCView.registerCallback(AdobeDC.View.Enum.CallbackType.EVENT_LISTENER, function (event) {
		switch (event.type) {
			case "DOCUMENT_OPEN":
				gtag('event', 'DOCUMENT_OPEN', {
					'event_label': 'DOCUMENT_OPEN'
				});
				break;
			case 'PAGE_VIEW':
				gtag('event', 'PAGE_VIEW', {
					'event_label': 'PAGE_VIEW'
				});
				break;
			case 'DOCUMENT_DOWNLOAD':
				gtag('event', 'DOCUMENT_DOWNLOAD', {
					'event_label': 'DOCUMENT_DOWNLOAD'
				});
				break;
			case 'TEXT_COPY':
				gtag('event', 'TEXT_COPY', {
					'event_label': 'TEXT_COPY'
				});
				break;
		}
	}, {
		enablePDFAnalytics: true
	});
}

/** To validate pdf file */
function isValidPDF(file) {
	if (file.type === "application/pdf") {
		return true;
	}
	if (file.type === "" && file.name) {
		var fileName = file.name;
		var lastDotIndex = fileName.lastIndexOf(".");
		return !(lastDotIndex === -1 || fileName.substr(lastDotIndex).toUpperCase() !== "PDF");
	}
	return false;
}

/** To set file preview */
function setFileToPreview(adobeDCView, viewerConfig) {
	if (files.length > 0 && isValidPDF(files[0])) {
		var reader = new FileReader();
		reader.onloadend = function (e) {
			var filePromise = Promise.resolve(e.target.result);
			adobeDCView.previewFile({
				content: {
					promise: filePromise
				},
				metaData: {
					fileName: files[0].name
				}
			}, viewerConfig)
		};
		reader.readAsArrayBuffer(files[0]);
	}
}

