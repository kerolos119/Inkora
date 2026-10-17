package com.kerolos119.inkora.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;

@Service 
public class CloudinarySevice {
    
    private final Cloudinary cloudinary;

    public CloudinarySevice(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    private static final Map<String, String> FOLDERS = Map.of(
        "book", "inkora/books",
        "post", "inkora/posts",
        "news", "inkora/news"
    );

    public String uploadImage(MultipartFile file, String type) throws IOException {

        if(file == null || file.isEmpty()) {
            throw new CustomException(ExceptionMessage.FILE_NOT_EMPTY);
        }

        String contentType =  file.getContentType();
        if(type == null || !type.startsWith("image/")){
            throw new CustomException(ExceptionMessage.FILE_NOT_IMAGE);
        };

        String folder = FOLDERS.get(type == null ? "" : type.toLowerCase());
        if(folder == null) {
            throw new CustomException(ExceptionMessage.INVALID_UPLOAD_TYPE);
        }

        Map<?, ?> result = cloudinary.uploader().upload(
            file.getBytes(), 
            ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "image"
            ));
            return result.get("secure_url").toString();
    }
}
