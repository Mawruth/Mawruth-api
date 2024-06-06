import { Injectable } from '@nestjs/common';
import { Museums } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMuseumDto } from './dto/update-museum.dto';
import { handlePrismaError } from 'src/utils/prisma-error.util';
import { CreateMuseumDto } from './dto/create-museum.dto';

@Injectable()
export class MuseumsService {
	constructor(private readonly prismaService: PrismaService) { }

	async getAllMuseums(
		page: number,
		limit: number,
		search: string,
	): Promise<Museums[]> {
		let res: Promise<Museums[]>
		if (!page) {
			page = 1;
		}
		if (!limit) {
			limit = 10;
		}

		let filter = {};
		if (search) {
			filter = {
				OR: [
					{
						name: {
							contains: search,
							mode: 'insensitive',
						},
					},
					{
						city: {
							contains: search,
							mode: 'insensitive',
						},
					},
					{
						street: {
							contains: search,
							mode: 'insensitive',
						},
					},
				],
			}
		}
		try {
			res = this.prismaService.museums.findMany({
				skip: (page - 1) * limit,
				take: limit,
				where: filter,
				orderBy: {
					id: 'desc',
				},
			});
		} catch (error) {
			handlePrismaError(error);
		}
		return res;
	}

	async getMuseumById(id: number): Promise<Museums> {
		let res: Promise<Museums>
		try {
			res = this.prismaService.museums.findUnique({
				where: {
					id: id,
				},
			});
		} catch (error) {
			handlePrismaError(error);
		}
		return res;
	}

	async createMuseum(museum: CreateMuseumDto): Promise<Museums> {
		let res: Promise<Museums>
		try {
			res = this.prismaService.museums.create({
				data: museum,
			});
		} catch (error) {
			handlePrismaError(error);
		}
		return res;
	}

	async editMuseum(id: number, data: UpdateMuseumDto): Promise<Museums> {
		let res: Promise<Museums>
		try {
			res = this.prismaService.museums.update({
				where: {
					id: id,
				},
				data: {
					name: data.name,
					description: data.description,
					city: data.city,
					street: data.street,
				},
			});
		} catch (error) {
			handlePrismaError(error);
		}
		return res;
	}

	async deleteMuseum(id: number): Promise<Museums> {
		let res: Promise<Museums>
		try {
			res = this.prismaService.museums.delete({
				where: {
					id: id,
				},
			});
		} catch (error) {
			handlePrismaError(error);
		}
		return res;
	}

}
