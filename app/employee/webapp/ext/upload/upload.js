sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/ui/core/HTML"
], function (MessageToast, JSONModel, Dialog, Button, HTML) {
    'use strict';

    return {
        upload: async function(oBindingContext, aSelectedContexts) {
            console.log(aSelectedContexts);
            
            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true
            };

            try {
                // Invoke the action to get the Base64 PDF from the backend
                let result = await this.editFlow.invokeAction('empsrv.upload', mParameters);
                let base64PDF = result.getObject().value;  // Assuming the backend response contains the Base64 PDF

                // Convert Base64 PDF to Blob
                let binary = atob(base64PDF);
                let len = binary.length;
                let buffer = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    buffer[i] = binary.charCodeAt(i);
                }
                let blob = new Blob([buffer], { type: 'application/pdf' });

                // Create a URL for the Blob
                let pdfUrl = URL.createObjectURL(blob);

                // Create an HTML control with an iframe to show the PDF
                let oHTML = new HTML({
                    content: `<iframe src="${pdfUrl}" width="700px" height="2000px" style="border: none;"></iframe>`
                });

                // Create and open a dialog box
                let oDialog = new Dialog({
                    title: 'Employee PDF',
                    contentWidth: "700px",
                    contentHeight: "500px",
                    content: [oHTML],
                    beginButton: new Button({
                        text: 'Close',
                        press: function () {
                            oDialog.close();
                        }
                    }),
                    afterClose: function () {
                        oDialog.destroy();
                    }
                });

                oDialog.open();  // Open the dialog with the PDF

            } catch (error) {
                console.error("Error occurred during XML export:", error);
                MessageToast.show("Failed to export XML.");
            }
        }
    };
});
/*
sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "jquery.sap.global",
	
], function (MessageToast,
	JSONModel,
	JquerySapglobal,
	Value) {
    'use strict';

    return {
        upload: async function(oBindingContext, aSelectedContexts) {
            
            
                console.log(aSelectedContexts);
                
                let mParameters = {
                    contexts: aSelectedContexts[0],
                    label: 'Confirm',  
                    invocationGrouping: true    
                };
     
                this.editFlow.invokeAction('empsrv.upload',mParameters).then(function (result) {
                    //let fileContent = result.data.fileContent;
                    console.log(result.getObject().value);
                    

           })
           
        }
    };
});
*/
/*
sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/ui/unified/FileUploader",
    "sap/m/VBox"
], function(MessageToast, Dialog, Button, Label, FileUploader, VBox) {
    'use strict';

    return {
        upload: function(oEvent) {

           // MessageToast.show("Custom handler invoked.");
           $.ajax({
            url: "/odata/v4/empsrv/generatePDF", // Replace with your service path
            method: "POST",
            xhrFields: {
                responseType: 'blob' // Important to handle binary data
            },
            success: function (data) {
                // Create a download link and trigger the download
                const blob = new Blob([data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'hospital_data.pdf'; // Specify the download filename
                link.click();
                MessageToast.show("PDF download started.");
            },
            error: function (error) {
                MessageToast.show("Error generating PDF.");
                console.error(error);
            }
        });
        */
        /*
            // Create a dialog with FileUploader
            if (!this._oDialog) {
                this._oDialog = new Dialog({
                    title: "Upload Dialog",
                    content: new VBox({
                        items: [
                            new Label({ text: "Please select a file to upload:" }), // Label for upload
                            new FileUploader({ // FileUploader control
                                id: "fileUploader", // Unique ID for the uploader
                                width: "100%",
                                placeholder: "Choose a file..."
                            })
                        ]
                    }),
                    beginButton: new Button({
                        text: "Upload",
                        press: function () {
                            // Get the selected file from the FileUploader
                            var oFileUploader = sap.ui.getCore().byId("fileUploader");
                            var oFile = oFileUploader.getFocusDomRef().files[0];
                            
                            if (oFile) {
                                // Perform the file upload or handle the file as needed
                                MessageToast.show("File selected: " + oFile.name);

                                // You can add your custom logic here for uploading the file, e.g., POST request to the backend

                                this._oDialog.close();
                            } else {
                                MessageToast.show("No file selected.");
                            }
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "Close",
                        press: function () {
                            this._oDialog.close();
                        }.bind(this)
                    })
                });
            }

            // Open the dialog
            this._oDialog.open();
            */
           /*
        }
            
    };
    
});
*/

