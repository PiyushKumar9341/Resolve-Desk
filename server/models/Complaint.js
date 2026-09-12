const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Hostel', 'Academic', 'Infrastructure', 'Canteen & Mess', 'Sports & Ground', 'Other']
    },
    subCategory: {
      type: String,
      default: 'General'
    },
    blockLocation: {
      type: String,
      default: 'Other'
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending'
    },
    adminRemark: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    department: {
      type: String,
      default: ''
    },
    assignedStaff: {
      type: String,
      default: ''
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
          enum: ['Pending', 'In Progress', 'Resolved', 'Rejected']
        },
        remark: {
          type: String,
          default: ''
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        changedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
