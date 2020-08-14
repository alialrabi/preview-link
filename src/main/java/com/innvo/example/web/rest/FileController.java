package com.innvo.example.web.rest;

import com.innvo.example.domain.FileDB;
import com.innvo.example.service.FileStorageService;
import com.innvo.example.service.dto.FileResponse;
import com.innvo.example.service.dto.ResponseMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/file")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileDB> uploadFile(@RequestParam("file")MultipartFile file) {
        String message = "";
        try{
            FileDB fileDB = fileStorageService.store(file);
            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(fileDB);
        }catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + "!";
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/files")
    public ResponseEntity<List<FileResponse>> getListFiles() {
        List<FileResponse> files = fileStorageService.getAllFile().map(dbFile -> {
            String fileDownloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/file/files/").path(dbFile.getId()).toUriString();
            return new FileResponse(dbFile.getName(), fileDownloadUrl, dbFile.getType(), dbFile.getData().length);
        }).collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id){
        FileDB file = fileStorageService.getFile(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
            .body(file.getData());
    }

}
