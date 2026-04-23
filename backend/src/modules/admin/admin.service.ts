import { UserRole } from '../../../../shared/types/user.type.js';
import { ApiError } from '../../utils/ApiError.js';
import { User } from '../user/user.model.js';

export const AdminService = {
  async VerifySeller(sellerId: string, verify: boolean) {
    const user = await User.findById(sellerId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    if (user.role !== UserRole.SELLER) {
      throw new ApiError(403, 'User is not a seller');
    }
    user.isVerified = verify;
    await user.save();
    return user;
  },

  async getAllSellers() {
    const users = await User.find({ role: UserRole.SELLER });
    return users;
  },

  async BanUser(userId: string, BanReason: string, user: string) {
    const BanUser = await User.findById(userId);
    if (!BanUser) {
      throw new ApiError(404, 'User not found');
    }
    BanUser.BanDetails.isBan = true;
    BanUser.BanDetails.BanReason = BanReason;
    BanUser.BanDetails.BanBy = user;
    BanUser.BanDetails.BanAt = new Date();
    BanUser.isUpdateBy.isUpdateBy = user;
    BanUser.isUpdateBy.isUpdateAt = new Date();
    await BanUser.save();
    return BanUser;
  },

  async UnBanUser(userId: string, user: string) {
    const BanUser = await User.findById(userId);
    if (!BanUser) {
      throw new ApiError(404, 'User not found');
    }
    BanUser.BanDetails.isBan = false;
    BanUser.BanDetails.BanReason = '';
    BanUser.BanDetails.BanBy = '';
    BanUser.BanDetails.BanAt = new Date();
    BanUser.BanDetails.UnBanAt = new Date();
    BanUser.BanDetails.UnBanBy = user;
    BanUser.isUpdateBy.isUpdateBy = user;
    BanUser.isUpdateBy.isUpdateAt = new Date();
    await BanUser.save();
    return BanUser;
  },

  async CreateSeller(seller: any) {
    const user = await User.create(seller);
    return user;
  },
};
