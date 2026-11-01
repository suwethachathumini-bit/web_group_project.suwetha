<?php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request");
}

$title       = trim($_POST["title"] ?? "");
$subject     = $_POST["subject"] ?? "";
$description = trim($_POST["description"] ?? "");
$tags        = trim($_POST["tags"] ?? "");

$subjects = ["Database Systems", "Software Engineering", "Web Development", "Networking"];

if ($title === "" || !in_array($subject, $subjects)) {
    die("Title and a valid subject are required");
}

if (!isset($_FILES["file"]) || $_FILES["file"]["error"] !== UPLOAD_ERR_OK) {
    die("Please choose a file (error code: " . ($_FILES["file"]["error"] ?? "none") . ")");
}

$file = $_FILES["file"];
$ext  = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

if (!in_array($ext, ["pdf", "docx", "pptx"])) {
    die("Only PDF, DOCX, PPTX allowed");
}
if ($file["size"] > 10 * 1024 * 1024) {
    die("File is larger than 10 MB");
}

$newName = uniqid("mat_", true) . "." . $ext;

if (!is_dir("uploads")) {
    mkdir("uploads", 0755);
}
if (!move_uploaded_file($file["tmp_name"], "uploads/" . $newName)) {
    die("Could not save the file");
}

$conn = new mysqli("localhost", "root", "", "studycircle");
if ($conn->connect_error) {
    die("Database error: " . $conn->connect_error);
}

$stmt = $conn->prepare(
    "INSERT INTO materials (title, subject, description, tags, file_name, original_name, file_type)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("sssssss", $title, $subject, $description, $tags, $newName, $file["name"], $ext);
$stmt->execute();

$stmt->close();
$conn->close();


header("Location: study_materials.html?uploaded=1");
exit;


