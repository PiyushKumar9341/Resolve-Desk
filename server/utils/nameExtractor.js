/**
 * Utility function to extract a clean, human-readable display name from an email address.
 * Examples:
 *  - piyushkumar@gmail.com -> Piyush Kumar
 *  - piyush.kumar@gmail.com -> Piyush Kumar
 *  - piyush_kumar@gmail.com -> Piyush Kumar
 *  - rahul-sharma@gmail.com -> Rahul Sharma
 *  - 12345@gmail.com -> Student (Fallback)
 */

const COMMON_FIRST_NAMES = [
  'piyush', 'rahul', 'rohit', 'amit', 'ananya', 'priya', 'sumit', 'vikas',
  'aditya', 'neha', 'pooja', 'suresh', 'ramesh', 'sneha', 'arjun', 'varun',
  'deepak', 'divya', 'manish', 'sachin', 'vijay', 'ajay', 'sunil', 'anil',
  'alok', 'akash', 'karan', 'rohan', 'mohit', 'gaurav', 'sanjay', 'rajesh',
  'tarun', 'shivam', 'sourabh', 'abhishek', 'aman', 'ankit', 'ayush', 'chirag',
  'harsh', 'kartik', 'kunal', 'mayank', 'nikhil', 'nitin', 'prashant', 'rishi',
  'shubham', 'tushar', 'yash', 'nilesh', 'pankaj', 'vivek', 'sourab', 'aakash',
  'dinesh', 'ganesh', 'mahesh', 'naresh', 'paresh', 'satish', 'yoges', 'yogesh'
];

function capitalizeWord(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function extractNameFromEmail(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return 'Student';
  }

  const username = email.split('@')[0].trim();
  if (!username) return 'Student';

  // Remove digits
  let cleaned = username.replace(/[0-9]+/g, ' ');

  // Replace common delimiters (. _ - +) with spaces
  cleaned = cleaned.replace(/[\._\-+]+/g, ' ');

  // Split into raw words
  let words = cleaned.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return 'Student';
  }

  // Handle case where username was a single concatenated string without delimiters (e.g. "piyushkumar")
  if (words.length === 1) {
    const singleWord = words[0].toLowerCase();
    let splitFound = false;

    for (const firstName of COMMON_FIRST_NAMES) {
      if (singleWord.startsWith(firstName) && singleWord.length > firstName.length) {
        const lastNamePart = singleWord.slice(firstName.length);
        if (lastNamePart.length >= 2) {
          words = [firstName, lastNamePart];
          splitFound = true;
          break;
        }
      }
    }

    // CamelCase split fallback if no dictionary match (e.g. PiyushKumar)
    if (!splitFound) {
      const camelSplit = words[0].replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
      if (camelSplit.length > 1) {
        words = camelSplit;
      }
    }
  }

  const formattedName = words.map(capitalizeWord).join(' ');
  return formattedName.trim() || 'Student';
}

module.exports = {
  extractNameFromEmail
};
