const cds = require('@sap/cds');
const { create } = require('xmlbuilder2');
const axios = require('axios');
module.exports = cds.service.impl(async function () {

    this.on('upload','Employees', async (req) => {
      const {Employees}=this.entities
        console.log(req.params);
        const { ID } = req.params[0];  
        const rowData = await SELECT.one.from(Employees).where({ ID: ID });

        if (!rowData) {
            return req.error(404,' No data found for ID: ${ID}');
        }

        console.log("Row data:", rowData);
        const xmlData = create({ version: '1.0' })
            .ele('Employees')  // Root element
            .ele('ID').txt(rowData.ID).up()
            .ele('firstName').txt(rowData.firstName).up()
            .ele('lastName').txt(rowData.lastName).up()
            .ele('email').txt(rowData.email).up()
            .ele('position').txt(rowData.position).up()
            .end({ prettyPrint: true });  
        console.log("Generated XML:", xmlData);
        const base64EncodedXML = Buffer.from(xmlData).toString('base64');

        console.log("Base64 Encoded XML:", base64EncodedXML);
        try {
          const authResponse = await axios.get('https://chembonddev.authentication.us10.hana.ondemand.com/oauth/token', {
              params: {
                  grant_type: 'client_credentials'
              },
              auth: {
                  username: 'sb-ffaa3ab1-4f00-428b-be0a-1ec55011116b!b142994|ads-xsappname!b65488',
                  password: 'e44adb92-4284-4c5f-8d41-66f8c1125bc5$F4bN1ypCgWzc8CsnjwOfT157HCu5WL0JVwHuiuwHcSc='
              }
          });
          const accessToken = authResponse.data.access_token;
          console.log("Access Token:", accessToken);
          const pdfResponse = await axios.post('https://adsrestapi-formsprocessing.cfapps.us10.hana.ondemand.com/v1/adsRender/pdf?templateSource=storageName', {
              xdpTemplate: "PrePrintedLabel/Default",
              xmlData: base64EncodedXML, 
              formType: "print",
              formLocale: "",
              taggedPdf: 1,
              embedFont: 0
          }, {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
              }
          });
          const fileContent = pdfResponse.data.fileContent;
          console.log("File Content:", fileContent);
          return fileContent;

      } catch (error) {
          console.error("Error occurred:", error);
          return req.error(500, "An error occurred while processing your request.");
      }
        

       
    });
});
/*const cds = require('@sap/cds');
const axios = require('axios');
const qs = require('qs');

module.exports = cds.service.impl(async function () {
    console.log('Entities:', this.entities);

  const { Employees } = this.entities;

  this.on('generatePDF', async (req) => {
    try {
      // Query data from PostgreSQL
      const empData = await SELECT.from(Employees);

      // Process data for the PDF (Example: select the first hospital)
      const pdfData = empData.length ? empData[0] : null;

      if (!pdfData) {
        req.reject(404, 'No data found to generate PDF');
        return; // Ensure we return after rejection
      }

      // Call the PDF generation function
      const pdfBase64 = await generatePDF(pdfData);

      // Return the PDF as binary data
      return Buffer.from(pdfBase64, 'base64'); // Convert back to Buffer for binary response
    } catch (error) {
      req.reject(500, `Error generating PDF: ${error.message}`);
    }
  });
});

// Function to retrieve OAuth2 access token
async function getAccessToken() {
  const tokenUrl = "https://chembonddev.authentication.us10.hana.ondemand.com/oauth/token";
  const data = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'sb-ffaa3ab1-4f00-428b-be0a-1ec55011116b!b142994|ads-xsappname!b65488',
    'client_secret': 'e44adb92-4284-4c5f-8d41-66f8c1125bc5$F4bN1ypCgWzc8CsnjwOfT157HCu5WL0JVwHuiuwHcSc='
  });

  const response = await axios.post(tokenUrl, data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return response.data.access_token;
}

// Function to generate PDF using Adobe Forms Service
async function generatePDF(data) {
  const accessToken = await getAccessToken();

  const response = await axios({
    method: 'post',
    url: 'https://adsrestapi-formsprocessing.cfapps.us10.hana.ondemand.com/v1/forms/instances',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    data: {
      templateId: 'PrePrintedLabel/Default', // Your template path
      data: data // The data to be filled into the form
    },
    responseType: 'arraybuffer'
  });

  // Return Base64 encoded PDF data
  return Buffer.from(response.data).toString('base64');
}
  */
