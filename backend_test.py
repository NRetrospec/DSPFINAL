#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Galo Logistics Amazon DSP Website
Tests all API endpoints with various scenarios including validation, error handling, and database integration.
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any, List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://delivery-partner.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.passed_tests = 0
        self.failed_tests = 0
        
    def log_test(self, test_name: str, passed: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        result = {
            'test': test_name,
            'status': status,
            'passed': passed,
            'details': details,
            'timestamp': datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests += 1
        else:
            self.failed_tests += 1
            
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test GET /api/health endpoint"""
        print("\n=== Testing Health Check Endpoint ===")
        
        try:
            response = requests.get(f"{API_BASE_URL}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'status' in data and data['status'] == 'healthy':
                    self.log_test("Health Check - Valid Response", True, 
                                f"Status: {data.get('status')}, Service: {data.get('service')}")
                else:
                    self.log_test("Health Check - Invalid Response Format", False, 
                                f"Missing or invalid status field: {data}")
            else:
                self.log_test("Health Check - HTTP Error", False, 
                            f"Status code: {response.status_code}, Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Health Check - Connection Error", False, str(e))
    
    def test_company_stats(self):
        """Test GET /api/stats endpoint"""
        print("\n=== Testing Company Stats Endpoint ===")
        
        try:
            response = requests.get(f"{API_BASE_URL}/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['team_members', 'years_experience', 'on_time_delivery', 
                                 'customer_rating', 'daily_packages', 'daily_miles', 'service_days']
                
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    self.log_test("Company Stats - Valid Response", True, 
                                f"All required fields present: {list(data.keys())}")
                else:
                    self.log_test("Company Stats - Missing Fields", False, 
                                f"Missing fields: {missing_fields}")
            else:
                self.log_test("Company Stats - HTTP Error", False, 
                            f"Status code: {response.status_code}, Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Company Stats - Connection Error", False, str(e))
    
    def test_testimonials(self):
        """Test GET /api/testimonials endpoint"""
        print("\n=== Testing Testimonials Endpoint ===")
        
        try:
            response = requests.get(f"{API_BASE_URL}/testimonials", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check first testimonial structure
                        testimonial = data[0]
                        required_fields = ['name', 'location', 'quote', 'rating']
                        missing_fields = [field for field in required_fields if field not in testimonial]
                        
                        if not missing_fields:
                            # Check if only active testimonials are returned
                            active_only = all(t.get('is_active', True) for t in data)
                            self.log_test("Testimonials - Valid Response", True, 
                                        f"Found {len(data)} testimonials, all active: {active_only}")
                        else:
                            self.log_test("Testimonials - Invalid Structure", False, 
                                        f"Missing fields in testimonial: {missing_fields}")
                    else:
                        self.log_test("Testimonials - Empty Response", True, 
                                    "No testimonials found (valid empty response)")
                else:
                    self.log_test("Testimonials - Invalid Response Type", False, 
                                f"Expected list, got: {type(data)}")
            else:
                self.log_test("Testimonials - HTTP Error", False, 
                            f"Status code: {response.status_code}, Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Testimonials - Connection Error", False, str(e))
    
    def test_faqs(self):
        """Test GET /api/faqs endpoint"""
        print("\n=== Testing FAQs Endpoint ===")
        
        try:
            response = requests.get(f"{API_BASE_URL}/faqs", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check first FAQ structure
                        faq = data[0]
                        required_fields = ['question', 'answer']
                        missing_fields = [field for field in required_fields if field not in faq]
                        
                        if not missing_fields:
                            # Check if FAQs are ordered and active only
                            active_only = all(f.get('is_active', True) for f in data)
                            ordered = all(data[i].get('order', 0) <= data[i+1].get('order', 0) 
                                        for i in range(len(data)-1)) if len(data) > 1 else True
                            
                            self.log_test("FAQs - Valid Response", True, 
                                        f"Found {len(data)} FAQs, all active: {active_only}, ordered: {ordered}")
                        else:
                            self.log_test("FAQs - Invalid Structure", False, 
                                        f"Missing fields in FAQ: {missing_fields}")
                    else:
                        self.log_test("FAQs - Empty Response", True, 
                                    "No FAQs found (valid empty response)")
                else:
                    self.log_test("FAQs - Invalid Response Type", False, 
                                f"Expected list, got: {type(data)}")
            else:
                self.log_test("FAQs - HTTP Error", False, 
                            f"Status code: {response.status_code}, Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("FAQs - Connection Error", False, str(e))
    
    def test_contact_form_valid(self):
        """Test POST /api/contact with valid data"""
        print("\n=== Testing Contact Form - Valid Submissions ===")
        
        valid_submissions = [
            {
                "name": "Maria Rodriguez",
                "email": "maria.rodriguez@email.com",
                "message": "I'm interested in your Amazon DSP services. Can you provide more information about partnership opportunities?"
            },
            {
                "name": "John Smith",
                "email": "john.smith@business.com", 
                "message": "Looking for reliable delivery partners in the Miami area. What are your coverage zones?"
            },
            {
                "name": "Sarah Johnson",
                "email": "sarah@logistics.com",
                "message": "We need a dependable DSP partner for our e-commerce business. What are your rates and service levels?"
            }
        ]
        
        for i, submission in enumerate(valid_submissions, 1):
            try:
                response = requests.post(
                    f"{API_BASE_URL}/contact",
                    json=submission,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ['id', 'name', 'email', 'message', 'submitted_at', 'status']
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields:
                        self.log_test(f"Contact Form Valid #{i}", True, 
                                    f"Submission saved with ID: {data.get('id')}")
                    else:
                        self.log_test(f"Contact Form Valid #{i} - Missing Fields", False, 
                                    f"Missing response fields: {missing_fields}")
                else:
                    self.log_test(f"Contact Form Valid #{i} - HTTP Error", False, 
                                f"Status code: {response.status_code}, Response: {response.text}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Contact Form Valid #{i} - Connection Error", False, str(e))
    
    def test_contact_form_invalid(self):
        """Test POST /api/contact with invalid data"""
        print("\n=== Testing Contact Form - Invalid Submissions ===")
        
        invalid_submissions = [
            {
                "test_name": "Missing Name",
                "data": {
                    "email": "test@email.com",
                    "message": "This should fail due to missing name"
                }
            },
            {
                "test_name": "Invalid Email",
                "data": {
                    "name": "Test User",
                    "email": "invalid-email",
                    "message": "This should fail due to invalid email format"
                }
            },
            {
                "test_name": "Missing Message",
                "data": {
                    "name": "Test User",
                    "email": "test@email.com"
                }
            },
            {
                "test_name": "Empty Name",
                "data": {
                    "name": "",
                    "email": "test@email.com",
                    "message": "This should fail due to empty name"
                }
            },
            {
                "test_name": "Message Too Long",
                "data": {
                    "name": "Test User",
                    "email": "test@email.com",
                    "message": "x" * 1001  # Exceeds 1000 character limit
                }
            }
        ]
        
        for submission in invalid_submissions:
            try:
                response = requests.post(
                    f"{API_BASE_URL}/contact",
                    json=submission["data"],
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                # Should return 422 (validation error) or 400 (bad request)
                if response.status_code in [400, 422]:
                    self.log_test(f"Contact Form Invalid - {submission['test_name']}", True, 
                                f"Correctly rejected with status {response.status_code}")
                else:
                    self.log_test(f"Contact Form Invalid - {submission['test_name']}", False, 
                                f"Expected 400/422, got {response.status_code}: {response.text}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Contact Form Invalid - {submission['test_name']} - Connection Error", False, str(e))
    
    def test_invalid_endpoints(self):
        """Test invalid endpoints for proper error handling"""
        print("\n=== Testing Invalid Endpoints ===")
        
        invalid_endpoints = [
            "/api/nonexistent",
            "/api/contact/invalid",
            "/api/stats/extra",
            "/invalid"
        ]
        
        for endpoint in invalid_endpoints:
            try:
                response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=10)
                
                if response.status_code == 404:
                    self.log_test(f"Invalid Endpoint - {endpoint}", True, 
                                "Correctly returned 404 Not Found")
                else:
                    self.log_test(f"Invalid Endpoint - {endpoint}", False, 
                                f"Expected 404, got {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Invalid Endpoint - {endpoint} - Connection Error", False, str(e))
    
    def test_malformed_requests(self):
        """Test malformed requests"""
        print("\n=== Testing Malformed Requests ===")
        
        try:
            # Test malformed JSON
            response = requests.post(
                f"{API_BASE_URL}/contact",
                data="invalid json data",
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code in [400, 422]:
                self.log_test("Malformed JSON Request", True, 
                            f"Correctly rejected malformed JSON with status {response.status_code}")
            else:
                self.log_test("Malformed JSON Request", False, 
                            f"Expected 400/422, got {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Malformed JSON Request - Connection Error", False, str(e))
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Comprehensive Backend Testing for Galo Logistics Amazon DSP Website")
        print(f"🔗 Testing Backend URL: {API_BASE_URL}")
        print("=" * 80)
        
        # Run all test categories
        self.test_health_check()
        self.test_company_stats()
        self.test_testimonials()
        self.test_faqs()
        self.test_contact_form_valid()
        self.test_contact_form_invalid()
        self.test_invalid_endpoints()
        self.test_malformed_requests()
        
        # Print summary
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"📈 Success Rate: {(self.passed_tests / (self.passed_tests + self.failed_tests) * 100):.1f}%")
        
        if self.failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['passed']:
                    print(f"   ❌ {result['test']}: {result['details']}")
        
        return self.failed_tests == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend is working correctly.")
        exit(0)
    else:
        print(f"\n⚠️  {tester.failed_tests} test(s) failed. Please check the issues above.")
        exit(1)