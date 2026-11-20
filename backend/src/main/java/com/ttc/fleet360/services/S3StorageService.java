package com.ttc.fleet360.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class S3StorageService {

    private static final Logger log = LoggerFactory.getLogger(S3StorageService.class);

    @Value("${aws.s3.enabled:false}")
    private boolean s3Enabled;

    @Value("${aws.s3.bucket:ttc-fleet360-assets}")
    private String bucketName;

    @Value("${aws.s3.region:ap-south-1}")
    private String region;

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String key = (folder != null ? folder + "/" : "") + UUID.randomUUID() + extension;

        if (s3Enabled && !accessKey.isBlank() && !secretKey.isBlank()) {
            try {
                S3Client s3 = S3Client.builder()
                        .region(Region.of(region))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        ))
                        .build();

                PutObjectRequest putReq = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .build();

                s3.putObject(putReq, RequestBody.fromBytes(file.getBytes()));
                return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
            } catch (Exception e) {
                log.error("Failed to upload to AWS S3, fallback to local storage: {}", e.getMessage());
            }
        }

        // Local fallback storage for development
        Path uploadDir = Paths.get("uploads", folder != null ? folder : "");
        Files.createDirectories(uploadDir);
        Path targetPath = uploadDir.resolve(UUID.randomUUID() + extension);
        Files.write(targetPath, file.getBytes());
        return "/uploads/" + (folder != null ? folder + "/" : "") + targetPath.getFileName().toString();
    }
}
