import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';

// Helper to check if db is available
function checkDb() {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your Firebase configuration.');
  }
  return db;
}

// Generic Firestore operations
export class FirestoreService {
  
  // Create a new document
  static async create(collectionName: string, data: any) {
    try {
      const firestore = checkDb();
      const docRef = await addDoc(collection(firestore, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  // Get a single document by ID
  static async getById(collectionName: string, id: string) {
    try {
      const firestore = checkDb();
      const docRef = doc(firestore, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Get all documents from a collection
  static async getAll(collectionName: string) {
    try {
      const firestore = checkDb();
      const querySnapshot = await getDocs(collection(firestore, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  // Get documents with query constraints
  static async getWithQuery(collectionName: string, constraints: QueryConstraint[]) {
    try {
      const firestore = checkDb();
      const q = query(collection(firestore, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }

  // Update a document
  static async update(collectionName: string, id: string, data: any) {
    try {
      const firestore = checkDb();
      const docRef = doc(firestore, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return { id, ...data };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  static async delete(collectionName: string, id: string) {
    try {
      const firestore = checkDb();
      const docRef = doc(firestore, collectionName, id);
      await deleteDoc(docRef);
      return { id, deleted: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}

// Donor-specific operations
export class DonorService {
  private static collection = 'donors';

  static async createDonor(donorData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    donorType?: 'individual' | 'corporate' | 'foundation';
    tags?: string[];
  }) {
    return FirestoreService.create(this.collection, donorData);
  }

  static async getDonor(id: string) {
    return FirestoreService.getById(this.collection, id);
  }

  static async getAllDonors() {
    return FirestoreService.getAll(this.collection);
  }

  static async getDonorsByType(donorType: string) {
    return FirestoreService.getWithQuery(this.collection, [
      where('donorType', '==', donorType)
    ]);
  }

  static async searchDonorsByEmail(email: string) {
    return FirestoreService.getWithQuery(this.collection, [
      where('email', '==', email)
    ]);
  }

  static async updateDonor(id: string, updates: any) {
    return FirestoreService.update(this.collection, id, updates);
  }

  static async deleteDonor(id: string) {
    return FirestoreService.delete(this.collection, id);
  }
}

// Donation-specific operations
export class DonationService {
  private static collection = 'donations';

  static async createDonation(donationData: {
    donorId: string;
    amount: number;
    currency?: string;
    paymentMethod: string;
    stripePaymentId?: string;
    campaignId?: string;
    isRecurring?: boolean;
    frequency?: 'monthly' | 'quarterly' | 'annually';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    notes?: string;
  }) {
    return FirestoreService.create(this.collection, {
      ...donationData,
      currency: donationData.currency || 'USD',
      donationDate: new Date()
    });
  }

  static async getDonation(id: string) {
    return FirestoreService.getById(this.collection, id);
  }

  static async getDonationsByDonor(donorId: string) {
    return FirestoreService.getWithQuery(this.collection, [
      where('donorId', '==', donorId),
      orderBy('donationDate', 'desc')
    ]);
  }

  static async getDonationsByCampaign(campaignId: string) {
    return FirestoreService.getWithQuery(this.collection, [
      where('campaignId', '==', campaignId),
      orderBy('donationDate', 'desc')
    ]);
  }

  static async getRecentDonations(limitCount: number = 10) {
    return FirestoreService.getWithQuery(this.collection, [
      orderBy('donationDate', 'desc'),
      limit(limitCount)
    ]);
  }

  static async updateDonation(id: string, updates: any) {
    return FirestoreService.update(this.collection, id, updates);
  }

  static async deleteDonation(id: string) {
    return FirestoreService.delete(this.collection, id);
  }
}

// Campaign-specific operations
export class CampaignService {
  private static collection = 'campaigns';

  static async createCampaign(campaignData: {
    name: string;
    description: string;
    goal: number;
    startDate: Date;
    endDate: Date;
    type: 'general' | 'event' | 'program' | 'emergency';
    status: 'draft' | 'active' | 'completed' | 'cancelled';
  }) {
    return FirestoreService.create(this.collection, campaignData);
  }

  static async getCampaign(id: string) {
    return FirestoreService.getById(this.collection, id);
  }

  static async getActiveCampaigns() {
    return FirestoreService.getWithQuery(this.collection, [
      where('status', '==', 'active'),
      orderBy('startDate', 'desc')
    ]);
  }

  static async getAllCampaigns() {
    return FirestoreService.getWithQuery(this.collection, [
      orderBy('startDate', 'desc')
    ]);
  }

  static async updateCampaign(id: string, updates: any) {
    return FirestoreService.update(this.collection, id, updates);
  }

  static async deleteCampaign(id: string) {
    return FirestoreService.delete(this.collection, id);
  }
}

// Communication tracking
export class CommunicationService {
  private static collection = 'communications';

  static async logCommunication(communicationData: {
    donorId: string;
    type: 'email' | 'phone' | 'mail' | 'meeting' | 'text';
    subject?: string;
    content?: string;
    direction: 'inbound' | 'outbound';
    status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced';
    campaignId?: string;
  }) {
    return FirestoreService.create(this.collection, {
      ...communicationData,
      communicationDate: new Date()
    });
  }

  static async getCommunicationsByDonor(donorId: string) {
    return FirestoreService.getWithQuery(this.collection, [
      where('donorId', '==', donorId),
      orderBy('communicationDate', 'desc')
    ]);
  }

  static async getCommunicationsByCampaign(campaignId: string) {
    return FirestoreService.getWithQuery(this.collection, [
      where('campaignId', '==', campaignId),
      orderBy('communicationDate', 'desc')
    ]);
  }
}

// Export query helpers for custom queries
export { where, orderBy, limit, query } from 'firebase/firestore';
