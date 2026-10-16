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

    public String uploadImage(MultipartFile file) throws IOException {

        if(file == null || file.isEmpty()) {
            throw new CustomException(ExceptionMessage.FILE_NOT_EMPTY);
        }

        Map<?, ?> result = cloudinary.uploader().upload(
            file.getBytes(), 
            ObjectUtils.asMap(
                
                "folder", "inkora",
                "resource_type", "image"
            ));
            return result.get("secure_url").toString();
    }
}
