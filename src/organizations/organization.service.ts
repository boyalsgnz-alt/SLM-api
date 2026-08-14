import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from '../schemas/organization.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { UserService } from '../users/user.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel('Organization')
    private readonly organizationModel: Model<OrganizationDocument>,
    private readonly userService: UserService,
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
    usr: AuthenticatedUser,
  ): Promise<OrganizationDocument> {
    const org = new this.organizationModel({
      ...orgDto,
      createdBy: usr._id,
      owner: usr._id,
    });
    const orgDoc = await org.save();

    if (orgDoc) {
      await this.userService.updateMe(usr._id, { type: 'Owner' });
    }
    return orgDoc;
  }
}
