import sys
import json
import os
import face_recognition
import numpy as np
import pickle
from PIL import Image, ImageOps
import cv2

def preprocess_image(image_path):
    """이미지 전처리 함수 - 플러터에서 오는 이미지 호환성 개선"""
    try:
        pil_image = Image.open(image_path)
        
        pil_image = ImageOps.exif_transpose(pil_image)
        
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        
        temp_path = image_path.replace('.jpg', '_processed.jpg')
        pil_image.save(temp_path, 'JPEG', quality=95)
        
        return temp_path
    except Exception as e:
        print(f"이미지 전처리 오류: {str(e)}", file=sys.stderr)
        return image_path  

def register_face(image_path, user_id):
    processed_image_path = None
    try:
        processed_image_path = preprocess_image(image_path)
        
        image = face_recognition.load_image_file(processed_image_path)
        
        height, width = image.shape[:2]
        print(f"이미지 크기: {width}x{height}", file=sys.stderr)
        
        face_locations_hog = face_recognition.face_locations(image, model="hog")
        face_locations_cnn = face_recognition.face_locations(image, model="cnn") if len(face_locations_hog) == 0 else []
        
        face_locations = face_locations_hog if len(face_locations_hog) > 0 else face_locations_cnn
        
        print(f"검출된 얼굴 수: {len(face_locations)}", file=sys.stderr)
        
        if not face_locations:
            return {"success": False, "message": "얼굴을 찾을 수 없습니다. 이미지가 선명하고 얼굴이 정면을 향하는지 확인해주세요.", "error_code": 404}
        
        if len(face_locations) > 1:
            return {"success": False, "message": "여러 얼굴이 감지되었습니다. 한 명의 얼굴만 포함된 이미지를 사용해주세요.", "error_code": 400}
        
        face_encodings = face_recognition.face_encodings(image, face_locations)
        
        if not face_encodings:
            return {"success": False, "message": "얼굴 인코딩 생성에 실패했습니다.", "error_code": 500}
        
        face_encoding = face_encodings[0]
        encoding_str = pickle.dumps(face_encoding).hex()
        
        print(f"얼굴 등록 성공 - 사용자 ID: {user_id}", file=sys.stderr)
        
        return {
            "success": True,
            "message": "얼굴 등록 성공",
            "encoding": encoding_str,
            "userId": user_id
        }
    except Exception as e:
        print(f"얼굴 등록 오류: {str(e)}", file=sys.stderr)
        return {"success": False, "message": f"오류 발생: {str(e)}", "error_code": 500}
    finally:
        if processed_image_path and processed_image_path != image_path and os.path.exists(processed_image_path):
            try:
                os.remove(processed_image_path)
            except:
                pass

def recognize_face(image_path, face_encodings_data):
    processed_image_path = None
    try:
        processed_image_path = preprocess_image(image_path)
        
        image = face_recognition.load_image_file(processed_image_path)
        
        height, width = image.shape[:2]
        print(f"인식 이미지 크기: {width}x{height}", file=sys.stderr)
        
        face_locations_hog = face_recognition.face_locations(image, model="hog")
        face_locations_cnn = face_recognition.face_locations(image, model="cnn") if len(face_locations_hog) == 0 else []
        
        face_locations = face_locations_hog if len(face_locations_hog) > 0 else face_locations_cnn
        
        print(f"인식 시 검출된 얼굴 수: {len(face_locations)}", file=sys.stderr)
        
        if not face_locations:
            return {"success": False, "message": "얼굴을 찾을 수 없습니다. 이미지가 선명하고 얼굴이 정면을 향하는지 확인해주세요.", "error_code": 404}
        
        face_encodings = face_recognition.face_encodings(image, face_locations)
        
        if not face_encodings_data:
            return {"success": False, "message": "등록된 얼굴이 없습니다.", "error_code": 404}
        
        known_encodings = []
        known_user_ids = []
        
        for data in face_encodings_data:
            encoding = pickle.loads(bytes.fromhex(data['encoding']))
            known_encodings.append(encoding)
            known_user_ids.append(data['userId'])
        
        print(f"등록된 얼굴 수: {len(known_encodings)}", file=sys.stderr)
        
        for face_encoding in face_encodings:
            face_distances = face_recognition.face_distance(known_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            min_distance = face_distances[best_match_index]
            
            print(f"최소 거리: {min_distance}", file=sys.stderr)
            
            if min_distance <= 0.4:
                confidence = 1 - min_distance
                user_id = known_user_ids[best_match_index]
                
                print(f"얼굴 인식 성공 - 사용자 ID: {user_id}, 신뢰도: {confidence}", file=sys.stderr)
                
                return {
                    "success": True,
                    "message": "얼굴 인식 성공",
                    "userId": user_id,
                    "confidence": float(confidence)
                }
        
        return {"success": False, "message": "등록된 얼굴과 일치하지 않습니다.", "error_code": 404}
        
    except Exception as e:
        print(f"얼굴 인식 오류: {str(e)}", file=sys.stderr)
        return {"success": False, "message": f"오류 발생: {str(e)}", "error_code": 500}
    finally:
        if processed_image_path and processed_image_path != image_path and os.path.exists(processed_image_path):
            try:
                os.remove(processed_image_path)
            except:
                pass

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "message": "인자가 부족합니다.", "error_code": 400}))
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
        print(json.dumps({"success": False, "message": "잘못된 작업입니다.", "error_code": 400}))
