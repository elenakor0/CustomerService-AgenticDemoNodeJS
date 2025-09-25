import * as fs from 'fs';
import * as path from 'path';
import { CustomerSession } from '../types';

const SESSION_FILE = path.join(__dirname, '../../../data/customer_session.json');

/**
 * Save customer session to file
 */
export const saveCustomerSession = (customerName: string, pin: string): void => {
  try {
    const session: CustomerSession = {
      customerName,
      pin,
      authenticatedAt: new Date()
    };

    fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
    // console.log(`Session saved for ${customerName}`);
  } catch (error) {
    console.error('Error saving customer session:', error);
  }
};

/**
 * Get current customer session
 */
export const getCurrentSession = (): CustomerSession | null => {
  try {
    if (!fs.existsSync(SESSION_FILE)) {
      // console.log('No session file found');
      return null;
    }
    
    const data = fs.readFileSync(SESSION_FILE, 'utf-8');
    const session = JSON.parse(data);
    
    // Convert timestamp back to Date object
    session.authenticatedAt = new Date(session.authenticatedAt);
    
    // console.log(`Session found for ${session.customerName}`);
    return session;
  } catch (error) {
    console.error('Error reading customer session:', error);
    return null;
  }
}

/**
 * Clear customer session
 */
export const clearSession = (): void => {
  try {
    if (fs.existsSync(SESSION_FILE)) {
      fs.unlinkSync(SESSION_FILE);
    }
  } catch (error) {
    console.error('Error clearing customer session:', error);
  }
}

/**
 * Check if customer is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  const session = getCurrentSession();
  return session !== null;
};
