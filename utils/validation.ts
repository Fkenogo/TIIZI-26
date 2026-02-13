/**
 * Input validation utilities for Tiizi App
 * Prevents XSS, data corruption, and enforces data integrity
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class InputValidator {
  // Maximum lengths for various fields
  private static readonly MAX_LENGTHS = {
    username: 50,
    displayName: 100,
    bio: 500,
    groupName: 100,
    groupDescription: 1000,
    postContent: 1000,
    commentContent: 500,
    exerciseName: 100,
    workoutType: 50,
    challengeTitle: 200,
    challengeDescription: 1000,
    supportTitle: 200,
    supportDescription: 1000,
    pledgeAmount: 1000000, // Max $1M
    note: 500
  };

  // Allowed characters for usernames (alphanumeric + underscore, 3-50 chars)
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]{3,50}$/;
  
  // Safe characters for display names (letters, numbers, spaces, hyphens, apostrophes)
  private static readonly DISPLAY_NAME_REGEX = /^[a-zA-Z0-9\s\-']{1,100}$/;
  
  // Safe characters for group names and other text fields
  private static readonly SAFE_TEXT_REGEX = /^[a-zA-Z0-9\s\-_.,!?()&'":;]{1,}$/;

  /**
   * Sanitize text input to prevent XSS attacks
   */
  public static sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    // Remove potentially dangerous HTML tags and attributes
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
      .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
      .trim();
  }

  /**
   * Validate username format and length
   */
  public static validateUsername(username: string): ValidationResult {
    const errors: string[] = [];
    
    if (!username) {
      errors.push('Username is required');
      return { isValid: false, errors };
    }

    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (username.length > this.MAX_LENGTHS.username) {
      errors.push(`Username cannot exceed ${this.MAX_LENGTHS.username} characters`);
    }

    if (!this.USERNAME_REGEX.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    // Check for reserved usernames
    const reservedUsernames = ['admin', 'root', 'system', 'null', 'undefined', 'tiizi', 'support'];
    if (reservedUsernames.includes(username.toLowerCase())) {
      errors.push('This username is reserved');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate display name format and length
   */
  public static validateDisplayName(displayName: string): ValidationResult {
    const errors: string[] = [];
    
    if (!displayName) {
      errors.push('Display name is required');
      return { isValid: false, errors };
    }

    if (displayName.length > this.MAX_LENGTHS.displayName) {
      errors.push(`Display name cannot exceed ${this.MAX_LENGTHS.displayName} characters`);
    }

    if (!this.DISPLAY_NAME_REGEX.test(displayName)) {
      errors.push('Display name contains invalid characters');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate bio text
   */
  public static validateBio(bio: string): ValidationResult {
    const errors: string[] = [];
    
    if (!bio) {
      return { isValid: true, errors }; // Bio is optional
    }

    const sanitized = this.sanitizeText(bio);
    
    if (sanitized.length > this.MAX_LENGTHS.bio) {
      errors.push(`Bio cannot exceed ${this.MAX_LENGTHS.bio} characters`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate group name
   */
  public static validateGroupName(groupName: string): ValidationResult {
    const errors: string[] = [];
    
    if (!groupName) {
      errors.push('Group name is required');
      return { isValid: false, errors };
    }

    const sanitized = this.sanitizeText(groupName);
    
    if (sanitized.length > this.MAX_LENGTHS.groupName) {
      errors.push(`Group name cannot exceed ${this.MAX_LENGTHS.groupName} characters`);
    }

    if (!this.SAFE_TEXT_REGEX.test(sanitized)) {
      errors.push('Group name contains invalid characters');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate group description
   */
  public static validateGroupDescription(description: string): ValidationResult {
    const errors: string[] = [];
    
    if (!description) {
      return { isValid: true, errors }; // Description is optional
    }

    const sanitized = this.sanitizeText(description);
    
    if (sanitized.length > this.MAX_LENGTHS.groupDescription) {
      errors.push(`Group description cannot exceed ${this.MAX_LENGTHS.groupDescription} characters`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate post content
   */
  public static validatePostContent(content: string): ValidationResult {
    const errors: string[] = [];
    
    if (!content) {
      errors.push('Post content is required');
      return { isValid: false, errors };
    }

    const sanitized = this.sanitizeText(content);
    
    if (sanitized.length > this.MAX_LENGTHS.postContent) {
      errors.push(`Post content cannot exceed ${this.MAX_LENGTHS.postContent} characters`);
    }

    if (sanitized.length < 1) {
      errors.push('Post content cannot be empty');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate comment content
   */
  public static validateCommentContent(content: string): ValidationResult {
    const errors: string[] = [];
    
    if (!content) {
      errors.push('Comment content is required');
      return { isValid: false, errors };
    }

    const sanitized = this.sanitizeText(content);
    
    if (sanitized.length > this.MAX_LENGTHS.commentContent) {
      errors.push(`Comment cannot exceed ${this.MAX_LENGTHS.commentContent} characters`);
    }

    if (sanitized.length < 1) {
      errors.push('Comment cannot be empty');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate workout type
   */
  public static validateWorkoutType(workoutType: string): ValidationResult {
    const errors: string[] = [];
    
    if (!workoutType) {
      errors.push('Workout type is required');
      return { isValid: false, errors };
    }

    const sanitized = this.sanitizeText(workoutType);
    
    if (sanitized.length > this.MAX_LENGTHS.workoutType) {
      errors.push(`Workout type cannot exceed ${this.MAX_LENGTHS.workoutType} characters`);
    }

    if (sanitized.length < 1) {
      errors.push('Workout type cannot be empty');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate numeric values (reps, sets, duration, etc.)
   */
  public static validateNumeric(value: number | string, fieldName: string, min: number = 0, max: number = Infinity): ValidationResult {
    const errors: string[] = [];
    
    if (value === null || value === undefined) {
      errors.push(`${fieldName} is required`);
      return { isValid: false, errors };
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      errors.push(`${fieldName} must be a valid number`);
      return { isValid: false, errors };
    }

    if (numValue < min) {
      errors.push(`${fieldName} must be at least ${min}`);
    }

    if (numValue > max) {
      errors.push(`${fieldName} cannot exceed ${max}`);
    }

    if (!Number.isInteger(numValue) && fieldName !== 'durationSec') {
      errors.push(`${fieldName} must be a whole number`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate pledge amount
   */
  public static validatePledgeAmount(amount: number | string): ValidationResult {
    return this.validateNumeric(amount, 'Pledge amount', 0.01, this.MAX_LENGTHS.pledgeAmount);
  }

  /**
   * Validate challenge title
   */
  public static validateChallengeTitle(title: string): ValidationResult {
    const errors: string[] = [];
    
    if (!title) {
      errors.push('Challenge title is required');
      return { isValid: false, errors };
    }

    const sanitized = this.sanitizeText(title);
    
    if (sanitized.length > this.MAX_LENGTHS.challengeTitle) {
      errors.push(`Challenge title cannot exceed ${this.MAX_LENGTHS.challengeTitle} characters`);
    }

    if (sanitized.length < 3) {
      errors.push('Challenge title must be at least 3 characters long');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate support request
   */
  public static validateSupportRequest(title: string, description: string, amount: number): ValidationResult {
    const errors: string[] = [];
    
    const titleResult = this.validateChallengeTitle(title);
    const descResult = this.validateGroupDescription(description);
    const amountResult = this.validatePledgeAmount(amount);

    errors.push(...titleResult.errors, ...descResult.errors, ...amountResult.errors);

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate file uploads (images)
   */
  public static validateFile(file: File): ValidationResult {
    const errors: string[] = [];
    
    if (!file) {
      errors.push('File is required');
      return { isValid: false, errors };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('File must be an image (JPEG, PNG, WebP, or GIF)');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push('File size cannot exceed 5MB');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Comprehensive validation for user registration
   */
  public static validateUserRegistration(username: string, displayName: string, bio?: string): ValidationResult {
    const errors: string[] = [];
    
    const usernameResult = this.validateUsername(username);
    const displayNameResult = this.validateDisplayName(displayName);
    const bioResult = this.validateBio(bio || '');

    errors.push(...usernameResult.errors, ...displayNameResult.errors, ...bioResult.errors);

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Comprehensive validation for group creation
   */
  public static validateGroupCreation(name: string, description?: string): ValidationResult {
    const errors: string[] = [];
    
    const nameResult = this.validateGroupName(name);
    const descResult = this.validateGroupDescription(description || '');

    errors.push(...nameResult.errors, ...descResult.errors);

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Comprehensive validation for post creation
   */
  public static validatePostCreation(content: string, imageFile?: File): ValidationResult {
    const errors: string[] = [];
    
    const contentResult = this.validatePostContent(content);
    errors.push(...contentResult.errors);

    if (imageFile) {
      const fileResult = this.validateFile(imageFile);
      errors.push(...fileResult.errors);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Comprehensive validation for workout logging
   */
  public static validateWorkoutLogging(workoutType: string, reps?: number, sets?: number, durationSec?: number): ValidationResult {
    const errors: string[] = [];
    
    const typeResult = this.validateWorkoutType(workoutType);
    errors.push(...typeResult.errors);

    if (reps !== undefined) {
      const repsResult = this.validateNumeric(reps, 'Reps', 1, 1000);
      errors.push(...repsResult.errors);
    }

    if (sets !== undefined) {
      const setsResult = this.validateNumeric(sets, 'Sets', 1, 100);
      errors.push(...setsResult.errors);
    }

    if (durationSec !== undefined) {
      const durationResult = this.validateNumeric(durationSec, 'Duration', 1, 86400); // Max 24 hours
      errors.push(...durationResult.errors);
    }

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Higher-order function to wrap Firebase operations with validation
 */
export function withValidation<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  validator: (args: Parameters<T>) => ValidationResult
): T {
  return (async (...args: Parameters<T>) => {
    const validation = validator(args);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    return await operation(...args);
  }) as T;
}

/**
 * Utility function to safely get validated input
 */
export function getValidatedInput<T>(
  input: T,
  validator: (input: T) => ValidationResult,
  defaultValue: T
): T {
  const validation = validator(input);
  if (!validation.isValid) {
    console.warn('Input validation failed:', validation.errors);
    return defaultValue;
  }
  return input;
}