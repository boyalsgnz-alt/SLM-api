import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from '../schemas/organization.schema';
import { UserDocument } from '../schemas/user.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel('Organization')
    private readonly organizationModel: Model<OrganizationDocument>,
  ) {}

  async getMyOrganizations(
    usr: AuthenticatedUser,
  ): Promise<OrganizationDocument[] | null> {
    const orgas = await this.organizationModel.find({
      owner: usr._id,
    });
    return orgas;
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizationModel.find();
  }

  async createOrganization(
    orgDto: CreateOrganizationDto,
    usr: Partial<UserDocument>,
  ): Promise<OrganizationDocument> {
    return this.organizationModel.create({
      ...orgDto,
      createdBy: usr._id,
      owner: usr._id,
    });
  }
}
