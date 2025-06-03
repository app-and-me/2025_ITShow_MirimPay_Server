import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs-extra';

const execAsync = promisify(exec);

interface UploadedFile {
  buffer?: Buffer;
  path?: string;
  originalname: string;
  mimetype: string;
  size: number;
  fieldname: string;
  encoding: string;
  destination?: string;
  filename?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`${id}번 사용자를 찾을 수 없습니다.`);
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    await this.userRepo.delete(id);
    return { message: '삭제가 완료되었습니다.' };
  }

  async registerFace(userId: number, imageFile: UploadedFile) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (!imageFile) {
      throw new Error('이미지 파일이 제공되지 않았습니다.');
    }

    const uploadsDir = path.join(process.cwd(), 'uploads', 'faces');
    await fs.ensureDir(uploadsDir);

    const filename = `user_${userId}_${Date.now()}.jpg`;
    const imagePath = path.join(uploadsDir, filename);

    if (imageFile.path) {
      await fs.copy(imageFile.path, imagePath);
    } else if (imageFile.buffer) {
      await fs.writeFile(imagePath, imageFile.buffer);
    } else {
      throw new Error(
        '이미지 파일이 유효하지 않습니다. buffer 또는 path가 필요합니다.',
      );
    }

    try {
      const pythonScript = path.join(process.cwd(), 'public', 'face_api.py');
      const command = `python3 "${pythonScript}" register "${imagePath}" ${userId}`;
      console.log(command);
      const { stdout } = await execAsync(command);
      const result = JSON.parse(stdout) as {
        success: boolean;
        message: string;
        encoding?: string;
      };

      if (result.success && result.encoding) {
        user.faceImagePath = imagePath;
        user.faceEncoding = result.encoding;
        await this.userRepo.save(user);

        return {
          success: true,
          message: '얼굴 등록이 완료되었습니다.',
          userId: userId,
        };
      } else {
        await fs.remove(imagePath);
        throw new Error(result.message);
      }
    } catch (error: unknown) {
      await fs.remove(imagePath);
      throw new Error(
        `얼굴 등록 실패: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async recognizeFace(imageFile: UploadedFile) {
    if (!imageFile) {
      throw new Error('이미지 파일이 제공되지 않았습니다.');
    }

    const tempDir = path.join(process.cwd(), 'uploads', 'temp');
    await fs.ensureDir(tempDir);

    const filename = `temp_${Date.now()}.jpg`;
    const imagePath = path.join(tempDir, filename);

    if (imageFile.path) {
      await fs.copy(imageFile.path, imagePath);
    } else if (imageFile.buffer) {
      await fs.writeFile(imagePath, imageFile.buffer);
    } else {
      throw new Error(
        '이미지 파일이 유효하지 않습니다. buffer 또는 path가 필요합니다.',
      );
    }

    try {
      const users = await this.userRepo.find({
        where: { faceEncoding: Not(IsNull()) },
      });

      if (users.length === 0) {
        throw new Error('등록된 얼굴이 없습니다.');
      }

      const faceData = users.map((user) => ({
        userId: user.id,
        encoding: user.faceEncoding,
      }));

      const pythonScript = path.join(process.cwd(), 'public', 'face_api.py');
      const command = `python3 "${pythonScript}" recognize "${imagePath}" '${JSON.stringify(faceData)}'`;

      const { stdout } = await execAsync(command);
      const result = JSON.parse(stdout) as {
        success: boolean;
        message: string;
        userId?: number;
        confidence?: number;
      };

      await fs.remove(imagePath);

      if (result.success && result.userId) {
        const recognizedUser = await this.userRepo.findOne({
          where: { id: result.userId },
        });

        return {
          success: true,
          message: '얼굴 인식 성공',
          user: recognizedUser,
          confidence: result.confidence,
        };
      } else {
        throw new Error(result.message);
      }
    } catch (error: unknown) {
      await fs.remove(imagePath);
      throw new Error(
        `얼굴 인식 실패: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
