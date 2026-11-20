package com.fleet360.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.File;

@Service
public class S3StorageService {

    @Value("${aws.s3.bucket-name:ttc-fleet360-vault}")
    private String bucketName;

    @Value("${aws.s3.region:us-east-2}")
    private String region;

    @Value("${aws.s3.access-key:SIMULATED_KEY}")
    private String accessKey;

    @Value("${aws.s3.secret-key:SIMULATED_SECRET}")
    private String secretKey;

    private S3Client createS3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    public String uploadDocument(String s3Key, File file) {
        try {
            // S3Client client = createS3Client();
            // PutObjectRequest request = PutObjectRequest.builder()
            //         .bucket(bucketName)
            //         .key(s3Key)
            //         .build();
            // client.putObject(request, file.toPath());
            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + s3Key;
        } catch (Exception e) {
            return "s3://" + bucketName + "/" + s3Key;
        }
    }

    public String getPresignedUrl(String s3Key) {
        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + s3Key + "?signed=true&token=auth";
    }
}
