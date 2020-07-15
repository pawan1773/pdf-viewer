

/*
Copyright 2019 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/

/* Control the default view mode */
const viewerConfig = {
	/* Allowed possible values are "FIT_PAGE", "FIT_WIDTH" or "" */
	"defaultViewMode": "FIT_PAGE",
	"embedMode": "FULL_WINDOW",
	"showLeftHandPanel":false	
};

const profile = {
	userProfile: {
		name: 'topcoder',
		firstName: 'topcoder',
		lastName: 'topcoder',
		email: 'topcoder@gmail.com',
	}
};

/* Wait for Adobe Document Cloud View SDK to be ready */
document.addEventListener("adobe_dc_view_sdk.ready", function () {
	/* Initialize the AdobeDC View object */
	var adobeDCView = new AdobeDC.View({
		/* Pass your registered client id */
		clientId: "a1648e3fdc99492d88bb309c70832c4c",
		/* Pass the div id in which PDF should be rendered */
		divId: "adobe-dc-view",
	});
	listenForFileUpload(adobeDCView);
	adobeDCView.registerCallback(AdobeDC.View.Enum.CallbackType.EVENT_LISTENER, function (event) {
		alert(event.type);
		switch (event.type) {
			case "PDF_VIEWER_OPEN":
			    alert("PDF_VIEWER_OPEN===>");
				gtag('event', 'PDF_VIEWER_OPEN', {
				  'event_label': 'PDF_VIEWER_OPEN'
				});

				//ga('send', 'event', 'PDF_VIEWER_OPEN', event.data.fileName, 'pdf viewer open');
				break;
			case "DOCUMENT_OPEN":
				ga('send', 'event', 'DOCUMENT_OPEN', event.data.fileName, 'open document');
				break;
			case 'PAGE_VIEW':
				ga('send', 'event', 'PAGE_VIEW', `${event.data.pageNumber} of ${event.data.fileName}`, 'view page');
				break;
			case 'DOCUMENT_DOWNLOAD':
				ga('send', 'event', 'DOCUMENT_DOWNLOAD', event.data.fileName, 'download document');
				break;
			case 'TEXT_COPY':
				ga('send', 'event', 'TEXT_COPY', `${event.data.copiedText} of ${event.data.fileName}`, 'text copy');
				break;
		}
	}, {
            enablePDFAnalytics: true
        });
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
		
});

function listenForFileUpload(adobeDCView) {
	var fileToRead = document.getElementById("file-picker");
	fileToRead.addEventListener("change", function (event) {
		var files = fileToRead.files;
		if (files.length > 0) {
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
	}, false);
}

