import sys
import json
import os
import face_recognition
import numpy as np
import pickle
from PIL import Image

def register_face(image_path, user_id):
    try:
        image = face_recognition.load_image_file(image_path)
        face_locations = face_recognition.face_locations(image)
        
        if not face_locations:
            return {"success": False, "message": "얼굴을 찾을 수 없습니다."}
        
        if len(face_locations) > 1:
            return {"success": False, "message": "여러 얼굴이 감지되었습니다. 한 명의 얼굴만 포함된 이미지를 사용해주세요."}
        
        face_encoding = face_recognition.face_encodings(image, face_locations)[0]
        
        encoding_str = pickle.dumps(face_encoding).hex()
        
        return {
            "success": True,
            "message": "얼굴 등록 성공",
            "encoding": encoding_str,
            "userId": user_id
        }
    except Exception as e:
        return {"success": False, "message": f"오류 발생: {str(e)}"}

def recognize_face(image_path, face_encodings_data):
    try:
        image = face_recognition.load_image_file(image_path)
        face_locations = face_recognition.face_locations(image)
        
        if not face_locations:
            return {"success": False, "message": "얼굴을 찾을 수 없습니다."}
        
        face_encodings = face_recognition.face_encodings(image, face_locations)
        
        if not face_encodings_data:
            return {"success": False, "message": "등록된 얼굴이 없습니다."}
        
        known_encodings = []
        known_user_ids = []
        
        for data in face_encodings_data:
            encoding = pickle.loads(bytes.fromhex(data['encoding']))
            known_encodings.append(encoding)
            known_user_ids.append(data['userId'])
        
        for face_encoding in face_encodings:
            face_distances = face_recognition.face_distance(known_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            min_distance = face_distances[best_match_index]
            
            if min_distance <= 0.6:
                confidence = 1 - min_distance
                user_id = known_user_ids[best_match_index]
                
                return {
                    "success": True,
                    "message": "얼굴 인식 성공",
                    "userId": user_id,
                    "confidence": float(confidence)
                }
        
        return {"success": False, "message": "등록된 얼굴과 일치하지 않습니다."}
        
    except Exception as e:
        return {"success": False, "message": f"오류 발생: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "message": "인자가 부족합니다."}))
        sys.exit(1)
    
    operation = sys.argv[1]
    
    if operation == "register":
        image_path = sys.argv[2]
        user_id = int(sys.argv[3])
        result = register_face(image_path, user_id)
        print(json.dumps(result))
    
    elif operation == "recognize":
        image_path = sys.argv[2]
        face_data = json.loads(sys.argv[3])
        result = recognize_face(image_path, face_data)
        print(json.dumps(result))
    
    else:
        print(json.dumps({"success": False, "message": "잘못된 작업입니다."}))
