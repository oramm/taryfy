
import { google, drive_v3 } from 'googleapis';

// configure a JWT auth client
const privateKey = require("./PrivateKey.json");

export const jwtClient = new google.auth.JWT(
    privateKey.client_email,
    undefined,
    privateKey.private_key,
    [
        'https://www.googleapis.com/auth/drive',
        "https://www.googleapis.com/auth/spreadsheets",
    ]
);

export default class ServiceAccount {
    static async main(req: any) {
        try {
            await jwtClient.authorize();
            console.log("Authentication successfull.\n");
            req.session.credentials = jwtClient;
            // list the files once authenticated
            await this.listFiles(jwtClient);
        }
        catch (error) {
            throw (error);
        };
    }

    static async listFiles(auth: any) {

        const drive = google.drive({ version: 'v3', auth });
        const filesSchema = await drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',

        });
        if (filesSchema.data.files && filesSchema.data.files.length) {
            console.log('Files:');
            filesSchema.data.files.map((file: drive_v3.Schema$File) => {
                console.log(`${file.id}: ${file.name}`);
            });
        } else
            console.log('No files found.');
    }

}