import { v2 as cloudinary } from "cloudinary";

export default new (class CloudinaryConfig {
	upload() {
		cloudinary.config({
			cloud_name: 'dsus7hrnk',
			api_key: '758959438735139',
			api_secret: 'WCLAlQ8H7kIIDDLF_imQIDJHW_Q',
		});
	}

	async destination(image: any) {
		try {
			const cloudinaryResponse = await cloudinary.uploader.upload(
				"src/uploads/" + image,
				{
					folder: "circle-app",
				}
			);
			return cloudinaryResponse.secure_url;
		} catch (err) {
			throw err;
		}
	}
})();

