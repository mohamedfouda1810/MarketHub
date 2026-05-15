using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.Infrastructure.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;

        public FileStorageService(BlobServiceClient blobServiceClient, IConfiguration config)
        {
            _blobServiceClient = blobServiceClient;
            _containerName = config["AzureSettings:ContainerName"] ?? "markethub";
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            var blobClient = containerClient.GetBlobClient(Guid.NewGuid().ToString() + Path.GetExtension(fileName));
            
            await blobClient.UploadAsync(fileStream, new BlobHttpHeaders { ContentType = contentType });
            
            return blobClient.Uri.ToString();
        }

        public async Task DeleteFileAsync(string fileUrl)
        {
            var blobUri = new Uri(fileUrl);
            var blobClient = new BlobClient(blobUri);
            await blobClient.DeleteIfExistsAsync();
        }
    }
}
