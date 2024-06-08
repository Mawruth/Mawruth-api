import { PartialType } from '@nestjs/swagger';
import { CreateMuseumReviewDto } from './create-museum-review.dto';

export class UpdateMuseumReviewDto extends PartialType(CreateMuseumReviewDto) {}
